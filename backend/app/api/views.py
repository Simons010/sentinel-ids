from django.shortcuts import render
from django.db.models import Count
from django.utils import timezone
from django.conf import settings

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from datetime import timedelta

from app.alerts.models import Alert
from app.api.serializers import AlertSerializer
from ml_engine.detection.decision_engine import DecisionEngine
from app.api.serializers import NetworkLogSerializer
from app.detection.detection_service import DetectionService
from app.logs.models import NetworkLog
from app.alerts.models import Alert

decision_engine = DecisionEngine(
    settings.ML_MODEL_PATH, 
    settings.FEATURE_EXTRACTOR_PATH,
    ai_enabled = settings.AI_ANALYSIS_ENABLED
)
detection_service = DetectionService(decision_engine)

class LogIngestView(APIView): 
    
    def post(self, request): 

        serializer = NetworkLogSerializer(data=request.data, many=isinstance(request.data, list))

        if serializer.is_valid():

            logs = serializer.save()

            if not isinstance(logs, list):
                logs = [logs]

            results = []
            alerts_created = 0

            for log_instance in logs:

                analysis = detection_service.analyze_log(log_instance)

                if analysis["is_suspicious"]:
                    alerts_created += 1

                results.append({
                    "id": log_instance.id,
                    "suspicious": log_instance.is_suspicious,
                    "score": log_instance.ml_score
                })

            return Response({
                "status": "success",
                "processed": len(logs),
                "alerts_generated": alerts_created,
                "results": results
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

        total_logs_24h = logs_24h.count()
        total_alerts_24h = alerts_24h.count()

        severity_counts = list(
            alerts_24h.values("severity")
            .annotate(count=Count("severity"))
            .order_by("-count")
        )

        top_attacks = list(
            alerts_24h.values("attack_type")
            .annotate(count=Count("attack_type"))
            .order_by("-count")[:5]
        )

        return Response(
            {
                "total_logs_24h": total_logs_24h,
                "total_alerts_24h": total_alerts_24h,
                "severity_breakdown": severity_counts,
                "top_attacks": top_attacks,
            }
        )