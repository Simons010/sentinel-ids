from django.db import models
from app.logs.models import NetworkLog

class Alert(models.Model):
    # SEVERITY_LEVELS = [
    #     ('LOW', 'Low'),
    #     ('MEDIUM', 'Medium'),
    #     ('HIGH', 'High'),
    #     ('CRITICAL', 'Critical'),
    # ]   
    
    log = models.ForeignKey(NetworkLog, on_delete=models.CASCADE)
     
    severity = models.CharField( max_length=10)
    severity_score = models.IntegerField(default=0)
    attack_type = models.CharField(max_length=255, default='-')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    detected_by = models.CharField(max_length=50,default="Rule/ML/AI")
    
    def __str__(self):
        return f"{self.alert_type} - {self.severity}"