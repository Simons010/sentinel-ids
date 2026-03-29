from rest_framework import serializers
from app.logs.models import NetworkLog
from app.alerts.models import Alert
from ml_engine.normalization.normalizer import LogNormalizer
from dateutil.parser import parse as parse_date
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)
normalizer = LogNormalizer()


class NetworkLogSerializer(serializers.ModelSerializer):
    # Write-only input field — accepts the raw syslog string
    logs = serializers.CharField(write_only=True)

    class Meta:
        model = NetworkLog
        fields = "__all__"
        read_only_fields = ('ml_score', 'is_suspicious', 'log_type')

    def create(self, validated_data):
        raw_input = validated_data.pop('logs')

        try:
            normalized_entries = normalizer.normalize(raw_input)
        except Exception as e:
            logger.error(f"Normalization failed: {e}")
            raise serializers.ValidationError({"logs": f"Normalization error: {e}"})

        if not normalized_entries:
            raise serializers.ValidationError({"logs": "No parseable log entries found."})

        instances = []
        for entry in normalized_entries:
            # Parse timestamp safely — syslog has no year, so we append current year
            parsed_ts = None
            raw_ts = entry.get("timestamp")
            if raw_ts:
                try:
                    current_year = timezone.now().year
                    parsed_ts = parse_date(f"{raw_ts} {current_year}")
                    if timezone.is_naive(parsed_ts):
                        parsed_ts = timezone.make_aware(parsed_ts)
                except Exception:
                    parsed_ts = timezone.now()  # fallback to now if unparseable
            else:
                parsed_ts = timezone.now()

            instance = NetworkLog.objects.create(
                timestamp=parsed_ts,
                host=entry.get("host"),
                process=entry.get("process"),
                pid=entry.get("pid"),
                src_ip=entry.get("src_ip") or None,
                dst_ip=entry.get("dst_ip") or None,
                src_port=entry.get("src_port") or None,
                dst_port=entry.get("dst_port") or None,
                protocol=entry.get("proto"),
                service=entry.get("service"),
                event_type=entry.get("event_type"),
                message=entry.get("message"),
                raw_log=entry.get("raw"),
            )
            instances.append(instance)

        return instances


class AlertSerializer(serializers.ModelSerializer):
    log_details = NetworkLogSerializer(source='log', read_only=True)

    class Meta:
        model = Alert
        fields = '__all__'