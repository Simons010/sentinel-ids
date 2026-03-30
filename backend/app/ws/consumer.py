import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LiveFeedConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        # All clients join the same broadcast group
        await self.channel_layer.group_add("live_feed", self.channel_name)
        await self.accept()
        await self.send(json.dumps({
            "type": "connection_established",
            "message": "Connected to Sentinel-IDS live feed"
            }))
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("live_feed", self.channel_name)
            
    # Receives broadcast from group_send - forwards to WebSocket client
    async def send_live_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))
        