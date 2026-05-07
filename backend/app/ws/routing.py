from django.urls import path
from app.ws.consumer import LiveFeedConsumer

websocket_urlpatterns = [
    path('ws/live-feed/', LiveFeedConsumer.as_asgi()),
]