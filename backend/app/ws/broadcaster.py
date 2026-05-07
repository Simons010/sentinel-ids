import json
import threading
import queue
import time
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Global queue for batching events
_event_queue = queue.Queue()
_batch_thread_started = False
_batch_lock = threading.Lock()

def _batch_worker():
    """Background worker to batch events and send them in intervals"""
    channel_layer = get_channel_layer()
    while True:
        batch = []
        # Wait for the first item
        try:
            item = _event_queue.get(timeout=0.5)
            batch.append(item)
            
            # Pull as many items as possible within a small window
            start_time = time.time()
            while len(batch) < 50 and (time.time() - start_time) < 0.1:
                try:
                    item = _event_queue.get_nowait()
                    batch.append(item)
                except queue.Empty:
                    break
        except queue.Empty:
            continue

        if batch and channel_layer:
            try:
                async_to_sync(channel_layer.group_send)(
                    "live_feed",
                    {
                        "type": "live_event_batch",
                        "events": batch
                    }
                )
            except Exception as e:
                print(f"FAILED to broadcast batch: {e}")

def broadcast_log_event(log_instance, analysis):
    """
    Push a live event to the batching queue.
    """
    global _batch_thread_started
    
    with _batch_lock:
        if not _batch_thread_started:
            t = threading.Thread(target=_batch_worker, daemon=True, name="ws-batcher")
            t.start()
            _batch_thread_started = True

    ai_info = analysis.get("ai_analysis") or {}
    
    event_data = {
        "id": log_instance.id,
        "text": ai_info.get("explanation") or f"Traffic from {log_instance.src_ip}",
        "severity": ai_info.get("severity") or "informational",
        "attack_type": ai_info.get("attack_type"),
        "src_ip": log_instance.src_ip,
        "timestamp": log_instance.timestamp.isoformat() if log_instance.timestamp else None,
    }
    
    _event_queue.put(event_data)   
    