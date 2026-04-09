import os

from django.shortcuts import render
from django.db.models import Count, Max
from django.utils import timezone
from django.conf import settings

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from datetime import timedelta

from app.detection.detection_service import detection_service
from app.alerts.models import Alert
from app.api.serializers import AlertSerializer, NetworkLogSerializer, ReportSerializer, UploadedFileSerializer, SystemSettingsSerializer
from app.logs.models import NetworkLog, UploadedFile
from app.alerts.models import Alert 
from app.reports.models import Report
from app.settings_app.models import SystemSetting
from ml_engine.detection.correlator import BatchCorrelator
from ml_engine.normalization import normalizer

correlator = BatchCorrelator()


class AlertPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

class LogIngestView(APIView):
    
    def post(self, request): 

        serializer = NetworkLogSerializer(data=request.data)

        if serializer.is_valid():

            logs = serializer.save()

            if not isinstance(logs, list):
                logs = [logs]

            results = []
            alerts_created = 0

            # Individual log analysis
            for log_instance in logs:

                analysis = detection_service.analyze_log(log_instance)

                if analysis["is_suspicious"]:
                    alerts_created += 1

                results.append({
                    "id": log_instance.id,
                    "suspicious": log_instance.is_suspicious,
                    "score": log_instance.ml_score
                })
            
            # Batch correlation
            correlation = None
            if len(logs) > 1:
                correlation = correlator.correlate(logs)
                if correlation:
                    # create a single alert for the whole chain
                    detection_service._create_chain_alert(logs, correlation)
                    alerts_created += 1

            return Response({
                "status": "success",
                "processed": len(logs),
                "alerts_generated": alerts_created,
                "results": results,
                "correlation": correlation,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class AlertListView(generics.ListAPIView):
    
    serializer_class = AlertSerializer
    pagination_class = AlertPagination
    
    def get_queryset(self):
        queryset = Alert.objects.all().order_by("-created_at")
        severity = self.request.query_params.get("severity")
        search = self.request.query_params.get("search")

        if severity:
            queryset = queryset.filter(severity=severity)
        if search: 
            queryset = queryset.filter(attack_type__icontains=search)

        return queryset 

# Dashboard
class DashboardStatsView(APIView): 
    """
    Return aggregated statistics for the dashboard.
    """

    def get(self, request):

        last_24h = timezone.now() - timedelta(hours=24)

        logs_24h = NetworkLog.objects.filter(created_at__gte=last_24h)
        alerts_24h = Alert.objects.filter(created_at__gte=last_24h)
        
        total_logs = NetworkLog.objects.count()
        total_alerts = Alert.objects.count()
        
        #Threat level score (0-100) based on critical alert ratio
        critical_count = alerts_24h.filter(severity="critical").count()
        total_24h = alerts_24h.count() or 1  # avoid division by zero
        threat_level = min(100, int((critical_count / total_24h) * 100) + 30)
        
        # Hourly breakdown for the chart (last 24 hours)
        hourly_data = []
        for i in range (24):
            hour_start = timezone.now() - timedelta(hours=24 - i)
            hour_end = hour_start + timedelta(hours=1)
            normal = logs_24h.filter(
                timestamp__gte=hour_start, 
                timestamp__lt=hour_end,
                is_suspicious=False
            ).count()
            suspicious = logs_24h.filter(
                timestamp__gte=hour_start, 
                timestamp__lt=hour_end,
                is_suspicious=True
            ).count()
            confirmed = alerts_24h.filter(
                created_at__gte=hour_start, 
                created_at__lt=hour_end
            ).count()
            hourly_data.append({
                "hour": hour_start.strftime("%H:%M"),
                "normal": normal,
                "suspicious": suspicious,
                "confirmed": confirmed
            })
        
        top_sources = list(
            alerts_24h.exclude(log__src_ip=None)
            .values("log__src_ip")
            .annotate(count=Count("log__src_ip"), max_score=Max("severity_score"))
            .order_by("-count")[:5]
        )

        severity_counts = {
            s: alerts_24h.filter(severity=s).count() 
            for s in ["critical", "high", "medium", "low"]
        }

        # Ml model accuracy from analytics 
        tp = logs_24h.filter(is_suspicious=True, ml_score__gte=0.5).count()
        tn = logs_24h.filter(is_suspicious=False, ml_score__lt=0.5).count()
        fp = logs_24h.filter(is_suspicious=False, ml_score__gte=0.5).count()
        fn = logs_24h.filter(is_suspicious=True, ml_score__lt=0.5).count()
        total_classified = tp + tn + fp + fn or 1
        accuracy = round((tp+tn) / total_classified * 100, 1) 
        
        return Response(
            {
                # stat cards
                "total_logs_24h": logs_24h.count(),
                "active_alerts": total_alerts,
                "critical_threats": critical_count,
                "anomaly_detection_rate": round(
                    logs_24h.filter(is_suspicious=True).count() / (logs_24h.count() or 1) * 100, 1
                    ),
                "model_accuracy": accuracy,
                "threat_level": threat_level,
                
                # charts
                "severity_breakdown": severity_counts,
                "hourly_threat_data": hourly_data,
                "top_attack_sources": top_sources,
                
                # AI Summary
                "ai_summary": self._get_ai_summary(alerts_24h),
            }
        )
        p
    def _get_ai_summary(self, alerts_qs):
        latest = Alert.objects.all().order_by("-created_at").first()
        if not latest:
            return None
        return {
            "result": latest.attack_type,
            "description": latest.description,
            "severity": latest.severity,
            "confidence": latest.log.ml_score if latest.log else 0,
        }

# Threats Page
class ThreatsStatsView(APIView):
    def get(self, request):
        alerts = Alert.objects.all()
        last_24h = timezone.now() - timedelta(hours=24)
        alerts_24h = Alert.objects.filter(created_at__gte=last_24h)
        
        #stats cards
        active_alerts = alerts.filter(severity__in=["critical", "high", "medium", "low"]).count()
        critical = alerts.filter(severity="critical").count()
        medium = alerts.filter(severity="medium").count()
          
        # Top threat vectors - group by attack_type, count,assign severity
        top_vectors = list(
            alerts.values("attack_type")
            .annotate(count=Count("attack_type"))
            .order_by("-count")[:5]
        )
        
        # Severity breakdown for pie chart
        severity_breakdown = {
            s: alerts_24h.filter(severity=s).count()
            for s in ["critical", "high", "medium", "low", "informational"]
        }
        
        # Threat level score
        total = alerts_24h.count() or 1
        crit_count = alerts_24h.filter(severity="critical").count()
        threat_level = min(100, int((crit_count / total) * 100) + 30)
        
        # AI summary - latest alert with ai analysis
        latest = alerts.order_by("created_at").first()
        ai_summary = None
        if latest:
            ai_summary = {
                "result": latest.attack_type,
                "description": latest.description,
                "severity": latest.severity,
                "confidence": round(latest.log.ml_score * 100, 1) if latest.log else 0,
            }
            
        return Response({
            "active_threats": active_alerts,
            "critical_threats": critical,
            "medium_priority": medium,
            "blocked_attacks": alerts.filter(severity__in=["critical", "high"]).count(),
            "threat_level": threat_level,
            "severity_breakdown": severity_breakdown,
            "top_threat_vectors": top_vectors,
            "ai_summary": ai_summary,
        })
        

# Network Page
class NetworkStatsView(APIView):
    def get(self, request):
        last_7d = timezone.now() - timedelta(days=7)
        alerts = Alert.objects.filter(created_at__gte=last_7d)
        
        # Geo data
        top_sources = list(
            alerts.exclude(log__src_ip=None)
            .values("log__src_ip")
            .annotate(count=Count("id"), risk=Max("severity_score"))
            .order_by("-count")[:10]
        )
        
        # Heatmap data (hourly for last 7 days)
        heatmap = []
        for days_offset in range(7):
            day = timezone.now() - timedelta(days=6 - days_offset)
            for hour in range(24):
                dt = timezone.datetime.combine(day, timezone.datetime.min.time()).replace(hour=hour)
                count = alerts.filter(
                    created_at__date=day,
                    created_at__hour=hour
                ).count()
                heatmap.append({"day": str(day), "hour": hour, "count": count})
        
        # Live feed (last 20 alerts)   
        recent = alerts.order_by("-created_at")[:20]
        live_feed = [
            f"{a.severity.capitalize()}: {a.attack_type} from {a.log.src_ip or 'unknown'} at {a.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
            for a in recent if a.log
        ]
        
        # Summary stats
        blocked_ips = NetworkLog.objects.exclude(src_ip=None).values("src_ip").distinct().count()
        countries_monitored = 20 # Placeholder for actual geo data processing
        
        return Response({
            "countries_monitored": countries_monitored,
            "attack_origins": top_sources.__len__(),
            "network_events": Alert.objects.filter(created_at__gte=last_7d).count(),
            "top_attack_sources": top_sources,
            "heatmap": heatmap,
            "live_feed": live_feed,
            "blocked_ips": blocked_ips,
        })
        
# Log Upload Page
class LogUploadView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=400)
        
        allowed = [".log", ".txt", ".json", ".csv"]
        ext = os.path.splitext(file.name)[1].lower()
        if ext not in allowed:
            return Response({"error": f"Unsupported file type: {ext}"}, status=400)
        
        if file.size > 50 * 1024 * 1024:  # 50 MB limit
            return Response({"error": "File exceeds 50MB limit"}, status=400)
        
        upload = UploadedFile.objects.create(
            file=file,
            filename=file.name,
            file_size=file.size,
            status="processing"
        )
        
        # Process file
        try:
            results = self._process_file(upload, ext)
            upload.status = "completed"
            upload.total_logs = results["total"]
            upload.valid_logs = results["valid"]
            upload.invalid_logs = results["invalid"]
            upload.parse_errors = results["errors"]
            upload.threats_found = results["threats"]
            upload.clean_logs = results["clean"]
            upload.save()
            
        except Exception as e:
            upload.status = "failed"
            upload.error_message = str(e)
            upload.save()
            return Response({"error": "Failed to process file", "details": str(e)}, status=500)
        
        return Response(UploadedFileSerializer(upload).data, status=201)
    
    def _process_file(self, upload, ext):
        raw = upload.file.read().decode("utf-8", errors="ignore")
        lines = [l.strip() for l in raw.splitlines() if l.strip()]
        total = len(lines)
        valid = invalid = errors = threats = clean = 0
        
        for line in lines:
            try:
                parsed = normalizer.normalize(line)
                if parsed:
                    valid += 1
                    # run detection on each line
                    serializer = NetworkLogSerializer(data={"logs":line})
                    if serializer.is_valid():
                        logs = serializer.save()
                        for log in (logs if isinstance(logs, list) else [logs]):
                            analysis = detection_service.analyze_log(log)
                            if analysis["is_suspicious"]:
                                threats += 1
                            else:
                                clean += 1
                else:
                        invalid += 1
            except Exception:
                errors += 1
                
        return {
            "total": total,
            "valid": valid,
            "invalid": invalid,
            "errors": errors,
            "threats": threats,
            "clean": clean
        }
    
    def get(self,request):
        uploads = UploadedFile.objects.order_by("-upload_at")
        return Response(UploadedFileSerializer(uploads, many=True).data)
    
# Analytics Page
class AnalyticsView(APIView):
    def get(self, request):
        logs = NetworkLog.objects.all()
        threshold = 0.5
        
        tp = logs.filter(is_suspicious=True, ml_score__gte=threshold).count()
        tn = logs.filter(is_suspicious=False, ml_score__lt=threshold).count()
        fp = logs.filter(is_suspicious=False, ml_score__gte=threshold).count()
        fn = logs.filter(is_suspicious=True, ml_score__lt=threshold).count()
        total = tp + tn + fp + fn or 1
        
        accuracy = round((tp + tn) / total * 100, 1)
        precision = round(tp / (tp + fp or 1) * 100, 1)
        recall = round(tp / (tp + fn or 1) * 100, 1)
        f1 = round(2 * precision * recall / (precision + recall or 1), 1)
        
        # Attack type distribution
        attack_dist = list(
            Alert.objects.values("attack_type")
            .annotate(count=Count("attack_type"))
            .order_by("-count")[:5]
        )
        
        # Confidence score distribution (buckets 0-20, 20-40 etc.)
        buckets = [0, 0, 0, 0, 0]
        for log in logs.values_list("ml_score", flat=True):
            idx = min(int(log * 5), 4)
            buckets[idx] += 1
            
        # Anomaly Split
        total_logs = logs.count() or 1
        anomalous = logs.filter(is_suspicious=True).count()
        
        return Response({
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "confusion_matrix": {"tp": tp, "tn": tn, "fp": fp, "fn": fn},
            "attack_type_distribution": attack_dist,
            "anomaly_rate": round(anomalous / total_logs * 100, 2),
            "normal_count": total_logs - anomalous,
            "anomalous_count": anomalous,
            "confidence_distribution": [
                {"range": f"{i*20}-{(i+1)*20}%", "count": buckets[i]}
                for i in range(5)
            ],
            "model_info": {
                "type": "Random Forest",
                "version": "v2.4.1",
                "dataset_size": total_logs,
                # Last training
            }
        })
        
# Reports Page
class ReportView(APIView):
    def post(self, request):
        start = request.data.get("start_date")
        end = request.data.get("end_date")
        report_type = request.data.get("report_type", "threat_summary")
        fmt = request.data.get("formart", "json")
        
        start_dt = timezone.datetime.strptime(start, "%Y-%m-%d").date()
        end_dt = timezone.datetime.strptime(end, "%Y-%m-%d").date()
        
        logs = NetworkLog.objects.filter(
            timestamp__date__gte=start_dt,
            timestamp__date__lte=end_dt
        )
        alerts = Alert.objects.filter(
            created_at__date__gte=start_dt,
            created_at__date__lte=end_dt
            )
        
        top_attack = (
            alerts.values("attack_type")
            .annotate(c=Count("attack_type"))
            .order_by("-c")
            .first()
        )
        top_ip = (
            alerts.exclude(log__src_ip=None)
            .values("log__src_ip")
            .annotate(c=Count("id"))
            .order_by("-c")
            .first()
        )
        
        report = Report.objects.create(
            name = f"{report_type.replace('_', ' ').title()} - {end_dt.strftime('%B %Y')}",
            report_type = report_type,
            format = fmt,
            start_date=start_dt,
            end_date=end_dt,
            generated_by=request.user if request.user.is_authenticated else None,
            total_logs=logs.count(),
            critical_threats=alerts.filter(severity="critical").count(),
            top_attack_type = top_attack["attack_type"] if top_attack else None,
        )
        
        return Response(ReportSerializer(report).data, status=201)
    
    def get(self, request):
        reports = Report.objects.order_by("-generated_at")
        return Response(ReportSerializer(reports, many=True).data)
    
# Settings Page
class SettingsView(APIView):
    def get(self, request):
        settings_obj, _ = SystemSetting.objects.get_or_create(
            user = request.user if request.user.is_authenticated else None
        )
        return Response(SystemSettingsSerializer(settings_obj).data)
    
    def patch(self,request):
        settings_obj, _ = SystemSetting.objects.get_or_create(
            user = request.user if request.user.is_authenticated else None
        )
        serializer = SystemSettingsSerializer(
            settings_obj, data=request.data, partial = True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400) 