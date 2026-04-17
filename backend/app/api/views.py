import io
import os

from django.http import FileResponse
from django.shortcuts import render
from django.db.models import Count, Max, Q
from django.utils import timezone
from django.conf import settings

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from datetime import datetime, time, timedelta

from app.detection.detection_service import detection_service
from app.alerts.models import Alert
from app.api.serializers import AlertSerializer, NetworkLogSerializer, ReportSerializer, UploadedFileSerializer, SystemSettingsSerializer, IntegrationApiKeySerializer, TeamMemberSerializer
from app.logs.models import NetworkLog, UploadedFile
from app.alerts.models import Alert 
from app.reports.models import Report
from app.reports.export import render_report_file_bytes, save_report_file
from app.reports.querysets import alerts_for_report_range, logs_for_report_range
from app.reports.report_payload import (
    VALID_REPORT_TYPES,
    build_report_snapshot,
    normalize_report_type,
)
from app.settings_app.models import SystemSetting, IntegrationApiKey, TeamMember
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
        all_alerts = Alert.objects.all()
        
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
            all_alerts.exclude(log__src_ip=None)
            .values("log__src_ip")
            .annotate(
                count=Count("id"), 
                max_score=Max("severity_score"))
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
            "severity_score": round(latest.severity_score * 100/4, 1) if latest.severity_score else 0,
            "confidence": round(latest.log.ml_score * 100, 1) if latest.log else 0,
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
        all_alerts = Alert.objects.all()
        
        # Stat cards
        unique_ips = NetworkLog.objects.exclude(src_ip=None).values("src_ip").distinct().count()
        network_events = NetworkLog.objects.count()
        
        # Top attack sources 
        top_sources = list(
            all_alerts.exclude(log__src_ip=None)
            .values("log__src_ip")
            .annotate(
                count=Count("id"), 
                max_score=Max("severity_score"))
            .order_by("-count")[:5]
        )
        
        # Heatmap data (hourly for last 7 days)
        heatmap = []
        for days_offset in range(7):
            day = (timezone.now() - timedelta(days=6 - days_offset)).date()
            day_row = []
            for hour in range(24):
                count = alerts.filter(
                    created_at__date=day,
                    created_at__hour=hour
                ).count()
                day_row.append(count)
            heatmap.append({
                "day": day.strftime("%a"),
                "date": str(day),
                "hours": day_row
            })
        # Heatmap summary stats
        all_hourly = [
            h for row in heatmap 
            for h in row["hours"]
            ]
        peak_hour_attacks = max(all_hourly) if all_hourly else 0
        total_weekly = sum(all_hourly)
        
        # Find most active hour across all days
        hour_totals = [
            sum(row["hours"][h] for row in heatmap)
            for h in range(24)
        ]
        most_active_hour = hour_totals.index(max(hour_totals)) if hour_totals else 0
        
        # Geo distribution (group by src_ip with counts)
        geo_sources = list(
            all_alerts.exclude(log__src_ip=None)
            .values("log__src_ip")
            .annotate(count=Count("id"), risk=Max("severity_score"))
            .order_by("-count")[:18]
        )
        
        # Live feed (last 20 alerts)   
        recent = Alert.objects.select_related("log").order_by("-created_at")[:20]
        live_feed = []
        for a in recent:
            if a.log:
                live_feed.append({
                    "id": a.id,
                    "text": f"{a.attack_type} from {a.log.src_ip or 'unknown'} ",
                    "severity": a.severity,
                    "src_ip": str(a.log.src_ip) if a.log.src_ip else None,
                    "timestamp": a.created_at.isoformat(),
                })
        
        # Severity breakdown for geo map stats
        critical_sources = sum(
            1 for s in geo_sources if s["risk"] >= 4
        )
        high_sources = sum(
            1 for s in geo_sources if s["risk"] == 3
        )
        
        return Response({
            # stat cards
            "countries_monitored": 142,  # placeholder for actual geo count
            "attack_origins": unique_ips,
            "network_events": network_events,
            "traffic_analyzed": f"{round(network_events * 0.0007, 1)} GB",
            
            # Components
            "top_attack_sources": top_sources,
            "heatmap": heatmap,
            "heatmap_summary": {
                "peak_hour_attacks": peak_hour_attacks,
                "total_weekly": total_weekly,
                "most_active_hour": f"{most_active_hour:02d}:00"
            },
            "geo_sources": geo_sources,
            "geo_summary": {
                "critical_zones": critical_sources,
                "high_risk_zones": high_sources,
                "total_countries": len(geo_sources),
                "blocked_ips": unique_ips
            },
            "live_feed": live_feed,
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
        uploads = UploadedFile.objects.order_by("-uploaded_at")
        return Response(UploadedFileSerializer(uploads, many=True).data)
    
# Analytics Page
class AnalyticsView(APIView):
    def get(self, request):
        logs = NetworkLog.objects.all()
        threshold = 0.5
        
        # ⚡ Bolt Optimization: Use a single aggregate query instead of multiple count() queries and Python-side loop
        agg_results = logs.aggregate(
            tp=Count('id', filter=Q(is_suspicious=True, ml_score__gte=threshold)),
            tn=Count('id', filter=Q(is_suspicious=False, ml_score__lt=threshold)),
            fp=Count('id', filter=Q(is_suspicious=False, ml_score__gte=threshold)),
            fn=Count('id', filter=Q(is_suspicious=True, ml_score__lt=threshold)),
            total_logs=Count('id'),
            anomalous=Count('id', filter=Q(is_suspicious=True)),
            b0=Count('id', filter=Q(ml_score__gte=0.0, ml_score__lt=0.2)),
            b1=Count('id', filter=Q(ml_score__gte=0.2, ml_score__lt=0.4)),
            b2=Count('id', filter=Q(ml_score__gte=0.4, ml_score__lt=0.6)),
            b3=Count('id', filter=Q(ml_score__gte=0.6, ml_score__lt=0.8)),
            b4=Count('id', filter=Q(ml_score__gte=0.8))
        )

        tp = agg_results['tp'] or 0
        tn = agg_results['tn'] or 0
        fp = agg_results['fp'] or 0
        fn = agg_results['fn'] or 0
        total_logs = agg_results['total_logs'] or 1
        anomalous = agg_results['anomalous'] or 0

        buckets = [
            agg_results['b0'] or 0,
            agg_results['b1'] or 0,
            agg_results['b2'] or 0,
            agg_results['b3'] or 0,
            agg_results['b4'] or 0
        ]

        total = tp + tn + fp + fn or 1
        
        accuracy = round((tp + tn) / total * 100, 1)
        precision = round(tp / (tp + fp or 1) * 100, 1)
        recall = round(tp / (tp + fn or 1) * 100, 1)
        f1 = round(2 * precision * recall / (precision + recall or 1), 1)
        
        last_24h = timezone.now() - timedelta(hours=24)
        hourly_threat_data = []
        for i in range(24):
            hour_start = timezone.now() - timedelta(hours=24 -i)
            hour_end = hour_start - timedelta(hours=1)
            normal = NetworkLog.objects.filter(
                created_at__gte=hour_start, 
                created_at__lt=hour_end,
                is_suspicious=False
            ).count()
            suspicious = NetworkLog.objects.filter(
                created_at__gte=hour_start,
                created_at__lt=hour_end,
                is_suspicious=True
            ).count()
            confirmed = Alert.objects.filter(
                created_at__gte=hour_start,
                created_at__lt=hour_end,
            ).count()
            hourly_threat_data.append({
                "hour": hour_start.strftime("%H:%M"),
                "normal": normal,
                "suspicious": suspicious,
                "confirmed": confirmed,
            })
        
        # Attack type distribution
        attack_dist = list(
            Alert.objects.values("attack_type")
            .annotate(count=Count("attack_type"))
            .order_by("-count")[:5]
        )
        
        return Response({
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "hourly_threat_data": hourly_threat_data,
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
        report_type = normalize_report_type(
            request.data.get("report_type", "threat_summary")
        )
        fmt = (request.data.get("format") or "json").lower()
        if fmt not in ("pdf", "csv", "json"):
            fmt = "json"
        if report_type not in VALID_REPORT_TYPES:
            return Response(
                {
                    "error": "Invalid report_type",
                    "allowed": sorted(VALID_REPORT_TYPES),
                },
                status=400,
            )
        
        if not start or not end:
            return Response({"error": "start_date and end_date are required"}, status=400)
        
        try:
            start_dt = datetime.strptime(start, "%Y-%m-%d").date()
            end_dt = datetime.strptime(end, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

        if start_dt > end_dt:
            return Response({"error": "start_date must be on or before end_date"}, status=400)

        # DateTimeField + USE_TZ: store aware datetimes (start of first day, end of last day)
        start_at = timezone.make_aware(datetime.combine(start_dt, time.min))
        end_at = timezone.make_aware(datetime.combine(end_dt, time.max))
        
        logs = logs_for_report_range(start_at, end_at)
        alerts = alerts_for_report_range(start_at, end_at)

        snapshot, overrides = build_report_snapshot(
            report_type, logs, alerts, start_dt, end_dt
        )

        report = Report.objects.create(
            name=f"{report_type.replace('_', ' ').title()} - {end_dt.strftime('%B %Y')}",
            report_type=report_type,
            format=fmt,
            start_date=start_at,
            end_date=end_at,
            generated_by=request.user if request.user.is_authenticated else None,
            total_logs=logs.count(),
            total_threats=alerts.count(),
            critical_threats=alerts.filter(severity="critical").count(),
            top_attack_type=overrides.get("top_attack_type"),
            snapshot=snapshot,
        )

        try:
            save_report_file(report)
        except Exception:
            # File on disk optional; download still uses render_report_file_bytes(report)
            pass

        report.refresh_from_db()
        data = ReportSerializer(report).data
        for key, value in snapshot.items():
            data[key] = value
        return Response(data, status=201)
    
    def get(self, request):
        reports = Report.objects.order_by("-generated_at")
        return Response(ReportSerializer(reports, many=True).data)


class ReportDownloadView(APIView):
    def get(self, request, pk):
        report = Report.objects.filter(pk=pk).first()
        if not report:
            return Response({"error": "Report not found"}, status=404)
        try:
            content, content_type, ext = render_report_file_bytes(report)
        except Exception:
            return Response({"error": "Could not build report file"}, status=500)
        filename = f"sentinel_report_{report.id}{ext}"
        return FileResponse(
            io.BytesIO(content),
            as_attachment=True,
            filename=filename,
            content_type=content_type,
        )


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


class IntegrationApiKeysView(APIView):
    def get(self, request):
        keys = IntegrationApiKey.objects.order_by("-created_at")
        return Response(IntegrationApiKeySerializer(keys, many=True).data)

    def post(self, request):
        name = request.data.get("name", "Generated API Key")
        key = IntegrationApiKey.objects.create(
            name=name,
            key_value=IntegrationApiKey.generate_key(),
        )
        return Response(IntegrationApiKeySerializer(key).data, status=201)


class IntegrationApiKeyDetailView(APIView):
    def delete(self, request, key_id):
        key = IntegrationApiKey.objects.filter(id=key_id).first()
        if not key:
            return Response({"error": "API key not found"}, status=404)
        key.revoked_at = timezone.now()
        key.save(update_fields=["revoked_at"])
        return Response({"status": "revoked"})


class TeamMembersView(APIView):
    def get(self, request):
        members = TeamMember.objects.order_by("-created_at")
        return Response(TeamMemberSerializer(members, many=True).data)

    def post(self, request):
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            return Response(TeamMemberSerializer(member).data, status=201)
        return Response(serializer.errors, status=400)


class TeamMemberDetailView(APIView):
    def patch(self, request, member_id):
        member = TeamMember.objects.filter(id=member_id).first()
        if not member:
            return Response({"error": "Team member not found"}, status=404)
        serializer = TeamMemberSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)