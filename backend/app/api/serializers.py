from rest_framework import serializers
from app.logs.models import NetworkLog, UploadedFile
from app.alerts.models import Alert
from app.reports.models import Report
from app.settings_app.models import SystemSetting
from ml_engine.normalization.normalizer import LogNormalizer
from ml_engine.normalization.enricher import LogEnricher
from dateutil.parser import parse as parse_date
from django.utils import timezone
import logging
import uuid
import json

logger = logging.getLogger(__name__)
normalizer = LogNormalizer()


class NetworkLogSerializer(serializers.ModelSerializer):
    # Accepts string, JSON object, list of strings, or list of JSON objects
    logs = serializers.JSONField(write_only=True)

    class Meta:
        model = NetworkLog
        fields = "__all__"
        read_only_fields = ('ml_score', 'is_suspicious', 'log_type')

    def create(self, validated_data):
        raw_input = validated_data.pop('logs')

        try:
            normalized_entries = self._normalize_input(raw_input)
        except Exception as e:
            logger.error(f"Normalization failed: {e}")
            raise serializers.ValidationError({"logs": f"Normalization error: {e}"})

        if not normalized_entries:
            raise serializers.ValidationError({"logs": "No parseable log entries found."})

        is_batch = len(normalized_entries) > 1
        session_id = uuid.uuid4() if is_batch else None

        instances = []
        for index, entry in enumerate(normalized_entries):
            instance = NetworkLog.objects.create(
                session_id=session_id,
                sequence_index=index if is_batch else None,
                timestamp=self._parse_timestamp(entry.get("timestamp")),
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

    def _normalize_input(self, raw_input):
        """
        Accept any of these formats and return a list of enriched dicts:

        1. Plain syslog string
           "Mar 24 08:10:01 server sshd[4101]: Failed password..."

        2. Multiline syslog string
           "Mar 24 08:10:01 server sshd...\nMar 24 08:10:45 server sudo..."

        3. Pre-structured JSON object
           { "src_ip": "1.2.3.4", "message": "...", "timestamp": "..." }

        4. List of syslog strings
           ["Mar 24 08:10:01 ...", "Mar 24 08:10:45 ..."]

        5. List of pre-structured JSON objects
           [{ "src_ip": "1.2.3.4", "message": "..." }, ...]

        6. Mixed list
           ["Mar 24 08:10:01 ...", { "src_ip": "1.2.3.4" }]
        """

        # Format 3 — single JSON object
        if isinstance(raw_input, dict):
            return [self._normalize_structured(raw_input)]

        # Formats 4, 5, 6 — list of strings or objects
        if isinstance(raw_input, list):
            results = []
            for item in raw_input:
                if isinstance(item, dict):
                    results.append(self._normalize_structured(item))
                elif isinstance(item, str):
                    results.extend(normalizer.normalize(item))
                else:
                    logger.warning(f"Skipping unsupported item type: {type(item)}")
            return results

        # Formats 1 & 2 — plain syslog string (single or multiline)
        if isinstance(raw_input, str):
            # Check if it's a JSON string that was sent as text
            stripped = raw_input.strip()
            if stripped.startswith("{") or stripped.startswith("["):
                try:
                    parsed = json.loads(stripped)
                    return self._normalize_input(parsed)  # recurse with parsed value
                except json.JSONDecodeError:
                    pass
            return normalizer.normalize(raw_input)

        raise serializers.ValidationError({
            "logs": f"Unsupported format: {type(raw_input).__name__}. "
                    f"Expected string, object, or array."
        })

    def _normalize_structured(self, obj):
        """
        A pre-structured JSON log already has fields extracted.
        Run it through the enricher only (skip the parser).
        Map common field name variations to our internal schema.
        """
        enricher = LogEnricher()

        # Flatten nested objects into top level
        flat = self._flatten(obj)
        
        # Normalise common field name variations from different log sources
        message = (
            flat.get("message") or
            flat.get("msg") or
            flat.get("log") or
            flat.get("text") or "" 
        )
        timestamp = (
            flat.get("timestamp") or
            flat.get("time") or
            flat.get("@timestamp") or
            flat.get("date") or None
        )
        src_ip = (
            flat.get("src_ip") or
            flat.get("source_ip") or
            flat.get("sourceIp") or
            flat.get("client_ip") or None
        )
        dst_ip = (
            flat.get("dst_ip") or
            flat.get("dest_ip") or
            flat.get("destination_ip") or
            obj.get("destIp") or None
        )
        
        src_port = flat.get("src_port") or flat.get("source_port")
        dst_port = flat.get("dst_port") or flat.get("dest_port") or flat.get("destination_port")
        proto = flat.get("proto") or flat.get("protocol") or flat.get("app_proto")
        
        # build message from action + app_proto if message is missing
        if not message and flat.get("action"):
            parts = []
            if flat.get("action"):
                parts.append(f"action={flat['action']}") 
            if flat.get("app_proto"):
                parts.append(f"proto={flat['app_proto']}")
            if flat.get("firewall_name"):
                parts.append(f"firewall={flat['firewall_name']}")
            message = " ".join(parts)

        # Build a parsed dict that matches what LogParser would produce
        parsed = {
            "timestamp": timestamp,
            "host":      flat.get("host") or flat.get("hostname") or flat.get("server") or flat.get("firewall_name"),
            "process":   flat.get("process") or flat.get("service") or flat.get("app"),
            "pid":       flat.get("pid"),
            "message":   message,
            "raw":       str(obj),
        }

        # extract network fields and event_type
        enriched = enricher.enrich(parsed)

        # Override with explicitly extracted network fields
        # (structured logs may already have these extracted)
        if src_ip:
            enriched["src_ip"] = src_ip
        if dst_ip:
            enriched["dst_ip"] = dst_ip
        if src_port:
            enriched["src_port"] = int(src_port)
        if dst_port:
            enriched["dst_port"] = int(dst_port)
        if proto:
            enriched["proto"] = proto.lower()

        return enriched
    
    def _flatten(self, obj, prefix="", sep="_"):
        """
        Recursively flatten a nested dict into a single level.
        { "event": { "src_ip": "1.2.3.4" } } → { "src_ip": "1.2.3.4", "event_src_ip": "1.2.3.4" }

        Keys from nested objects are available both with and without prefix
        so field lookups work regardless of nesting depth.
        """
        result = {}
        for key, value in obj.items():
            flat_key = f"{prefix}{sep}{key}" if prefix else key
            if isinstance(value, dict):
                # Add the nested keys both prefixed and unprefixed
                nested = self._flatten(value, flat_key, sep)
                result.update(nested)
                # Also add unprefixed versions so src_ip works without knowing it's nested
                unprefixed = self._flatten(value, "", sep)
                for k, v in unprefixed.items():
                    if k not in result:  # don't overwrite top-level fields
                        result[k] = v
            elif isinstance(value, list):
                # For lists of dicts (like request_headers), join values into a string
                if all(isinstance(i, dict) for i in value):
                    combined = " ".join(
                        str(v) for item in value for v in item.values()
                    )
                    result[flat_key] = combined
                else:
                    result[flat_key] = " ".join(str(i) for i in value)
            else:
                result[flat_key] = value
        return result

    def _parse_timestamp(self, raw_ts):
        if raw_ts:
            try:
                parsed = parse_date(f"{raw_ts} {timezone.now().year}")
                return timezone.make_aware(parsed) if timezone.is_naive(parsed) else parsed
            except Exception:
                pass
        return timezone.now()


class AlertSerializer(serializers.ModelSerializer):
    log_details = NetworkLogSerializer(source="log", read_only=True)

    class Meta:
        model = Alert
        fields = "__all__"


class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = [
            "id",
            "filename",
            "file_size",
            "uploaded_at",   # fixed typo
            "status",
            "total_logs",
            "valid_logs",
            "invalid_logs",
            "parse_errors",
            "threats_found",
            "clean_logs",    # fixed typo
            "error_message",
        ]
        read_only_fields = [
            "uploaded_at", "status", "total_logs", "valid_logs",
            "invalid_logs", "parse_errors", "threats_found",
            "clean_logs", "error_message",
        ]


class ReportSerializer(serializers.ModelSerializer):
    generated_by = serializers.StringRelatedField(read_only=True)
    file_size_display = serializers.SerializerMethodField()  # fixed — moved out of Meta

    class Meta:
        model = Report
        fields = [
            "id", "name", "report_type", "format",
            "start_date", "end_date", "generated_at", "generated_by",
            "file_size", "file_size_display",
            "total_logs", "total_threats", "critical_threats", "top_attack_type",
        ]
        read_only_fields = [
            "generated_at", "generated_by", "file_size",
            "total_logs", "total_threats", "critical_threats", "top_attack_type",
        ]

    def get_file_size_display(self, obj):  # fixed — now at serializer level
        size = obj.file_size or 0
        if size < 1024:       return f"{size} B"
        elif size < 1024**2:  return f"{size / 1024:.1f} KB"
        elif size < 1024**3:  return f"{size / 1024**2:.1f} MB"
        return f"{size / 1024**3:.1f} GB"


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = [
            "id",
            "email_alerts", "push_notifications",
            "slack_integration", "sms_alerts",
            "two_factor_auth", "auto_block_threats",
            "ip_whitelisting", "session_timeout",
            "retention_days", "auto_archive",
            "ai_model_mode", "continuous_learning", "ai_sensitivity",
        ]