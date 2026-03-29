from app.alerts.models import Alert
from ml_engine.detection.decision_engine import DecisionEngine
from django.conf import settings

_engine = DecisionEngine(
    settings.ML_MODEL_PATH, 
    settings.FEATURE_EXTRACTOR_PATH,
    
    # Initialize with AI enabled if key exists
    ai_enabled = settings.AI_ANALYSIS_ENABLED
)


class DetectionService:
    
    def __init__(self, engine):
        self.engine = engine
    
    def analyze_log(self, log_instance):

        log_data = {
            "message": log_instance.message or "",
            "src_ip": log_instance.src_ip or None,
            "dst_ip": log_instance.dst_ip or None,
            "src_port": log_instance.src_port or 0,
            "dst_port": log_instance.dst_port or 0,
            "proto": log_instance.protocol or "tcp",
            "service": log_instance.service or "unknown",
            
            "event_type": log_instance.event_type or "unknown",
            "host": log_instance.host or "unknown",
            "process": log_instance.process or "",
        }

        analysis = self.engine.analyze(log_data)

        log_instance.is_suspicious = analysis["is_suspicious"]
        log_instance.ml_score = analysis.get("confidence_score", 0.0)
        log_instance.save(update_fields=["is_suspicious", "ml_score"])

        if analysis["is_suspicious"]:
            self._create_alert(log_instance, analysis)
            ai_info = analysis.get("ai_analysis") or {}
            log_instance.log_type = f"Suspicious, Level: {ai_info.get("severity")}" 
        else:
            log_instance.log_type = "Informational/Normal"
            
        log_instance.save(update_fields=["log_type"])

        return analysis

    def _create_alert(self, log, analysis):
        
        attack_type = analysis.get("ai_analysis", {}).get("attack_type", "Suspicious Activity")
        
        severity = analysis.get("ai_analysis", {}).get("severity")
        if severity == "critical":
            severity_score = 4
        elif severity == "high":
            severity_score = 3
        elif severity == "medium":
            severity_score = 2  
        elif severity == "low":
            severity_score = 1
        else:
            severity_score = 0  # Default to informational if unknown
        
        Alert.objects.create(
            log=log,
            attack_type=attack_type,
            severity = severity,
            severity_score = severity_score,
            # alert_type="Suspicious Log Detected",
            description="\n".join(analysis.get("alerts", [])),
            
        )
        
    def _create_chain_alert(self, logs, correlation):
        severity_score_map = {
            "critical": 4,
            "high": 3,
            "medium": 2,
            "low": 1,
            }
        Alert.objects.create(
            log = logs[0],
            attack_type=correlation["chain_name"],
            severity = correlation["severity"],
            severity_score= severity_score_map.get(correlation["severity"], 0),
            description=(
                f"{correlation['description']}\n"
                f"Event chain: {' → '.join(correlation['event_sequence'])}\n"
                f"IPs involved: {', '.join(correlation['involved_ips'])}\n"
                f"Logs in batch: {correlation['log_count']}"
            )
        )
        
detection_service = DetectionService(_engine)
    