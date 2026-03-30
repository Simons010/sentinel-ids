from django.contrib import admin
from app.alerts.models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    
    list_display = [
        'log',
        'attack_type',
        'severity',
        'severity_score',
        'description',
        'created_at',
    ]
    
    search_fields = ['severity_score','severity','created_at']
