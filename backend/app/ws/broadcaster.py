import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

def broadcast_log_event(log_instance, analysis):
    """
    Push a live event to all connected dashboard/network page clients.
    Call this after every analyze_log() call.
    """
    ai_info = analysis.get("ai_analysis") or {}
    
    event_data = {
        "type": "live_event",
        "event": {
            "id": log_instance.id,
            "timestamp": log_instance.timestamp.isoformat() if log_instance.timestamp else None,
            "host": log_instance.host,
            "process": log_instance.process,
            "pid": log_instance.pid,
            "src_ip": str(log_instance.src_ip) if log_instance.src_ip else None,
            "dst_ip": str(log_instance.dst_ip) if log_instance.dst_ip else None,
            "src_port": log_instance.src_port,
            "dst_port": log_instance.dst_port,
            "protocol": log_instance.protocol,
            "service": log_instance.service,
            "event_type": log_instance.event_type,
            "message": log_instance.message,
            "is_suspicious": log_instance.is_suspicious,
            "severity": ai_info.get("severity", "informational"),
            "attack_type": ai_info.get("attack_type", "Normal"),
            "confidence": log_instance.ml_score,
        }
    }
    
    async_to_sync(channel_layer.group_send)(
        "live_feed",
        {
            "type": "live_event",
            "data": event_data
        }
    )   
    