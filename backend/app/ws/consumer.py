import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LiveFeedConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        print(f"WebSocket connection attempt: {self.channel_name}")
        try:
            # All clients join the same broadcast group
            await self.channel_layer.group_add("live_feed", self.channel_name)
            await self.accept()
            print(f"WebSocket connection accepted: {self.channel_name}")
            
            # Send initial connection message
            await self.send(json.dumps({
                "type": "connection_established",
                "message": "Connected to Sentinel-IDS live feed"
                }))
        except Exception as e:
            print(f"WebSocket connection error: {e}")
            await self.close()
        
    async def disconnect(self, close_code):
        print(f"WebSocket disconnected: {self.channel_name} with code {close_code}")
        await self.channel_layer.group_discard("live_feed", self.channel_name)
            
    # Receives broadcast from group_send - forwards to WebSocket client
    async def live_event_batch(self, event):
        # Send batch of events to client
        await self.send(text_data=json.dumps({
            "type": "live-event-batch",
            "events": event["events"]
        }))

    async def live_event(self, event):
        # Fallback for single events
        await self.send(text_data=json.dumps({
            "type": "live-event",
            "event": event["data"]
        }))
    
    # Handle incoming messages from client
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data.get("type") == "ping":
                await self.send(text_data=json.dumps({"type": "pong"}))
        except Exception as e:
            print(f"WebSocket receive error: {e}")
        