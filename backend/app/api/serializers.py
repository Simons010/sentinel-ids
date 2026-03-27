from rest_framework import serializers
from app.logs.models import NetworkLog
from app.alerts.models import Alert

class NetworkLogSerializer(serializers.ModelSerializer):
    class Meta: 
        model = NetworkLog
        fields = "__all__"
        read_only_fields = ('ml_score', 'is_suspicious', 'timestamp')
        
class AlertSerializer(serializers.ModelSerializer):
    log_details = NetworkLogSerializer(source='log', read_only=True)
    
    class Meta:
        model = Alert
        fields = '__all__' 

        