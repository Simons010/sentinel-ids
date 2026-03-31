from django.db import models
from app.logs.models import NetworkLog

class Alert(models.Model):
    SEVERITY_CHOICES = [
        ("critical", "Critical"),
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
        ("informational", "Informational"),
    ]  
    
    log = models.ForeignKey("logs.NetworkLog", on_delete=models.CASCADE)
     
    severity = models.CharField( 
        max_length=20, 
        choices=SEVERITY_CHOICES, 
        default="low"
    )
    severity_score = models.IntegerField(default=1)
    attack_type = models.CharField(max_length=255, default='-')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    detected_by = models.CharField(max_length=50,default="Rule/ML/AI")
    
    def __str__(self):
        return f"{self.attack_type} - {self.severity}"