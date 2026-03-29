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
from app.api.serializers import AlertSerializer
from app.api.serializers import NetworkLogSerializer
from app.logs.models import NetworkLog
from app.alerts.models import Alert
from ml_engine.detection.correlator import BatchCorrelator

correlator = BatchCorrelator()

class LogIngestView(APIView): 
    
    def post(self, request): 

        serializer = NetworkLogSerializer(data=request.data, many=isinstance(request.data, list))

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
    
    queryset = Alert.objects.all().order_by("-created_at")
    serializer_class = AlertSerializer
    pagination_class = PageNumberPagination
    
    def get_queryset(self):

        queryset = Alert.objects.all().order_by("-created_at")

        severity = self.request.query_params.get("severity")

        if severity:
            queryset = queryset.filter(severity=severity)

        return queryset 

class DashboardStatsView(APIView): 
    """
    Return aggregated statistics for the dashboard.
    """

    def get(self, request):

        last_24h = timezone.now() - timedelta(hours=24)

        logs_24h = NetworkLog.objects.filter(timestamp__gte=last_24h)
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
        
    def _get_ai_summary(self, alerts_qs):
        latest = alerts_qs.order_by("-created_at").first()
        if not latest:
            return None
        return {
            "result": latest.attack_type,
            "description": latest.description,
            "severity": latest.severity,
            "confidence": latest.log.ml_score if latest.log else 0,
        }