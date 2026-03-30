from django.db import models

#reports model
class Report(models.Model):
    REPORT_TYPES = [
        ("threat_summary", "Threat Summary Report"),
        ("log_activity", "Log Activity Report"),
        ("network_security", "Network Security Report"),
        ("ai_performance", "AI Detection Performance Report"),
    ]
    
    FORMAT_CHOICES = [
        ("pdf", "PDF"),
        ("csv", "CSV"),
        ("json", "JSON"),
    ]
    
    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(
        "auth.User", on_delete=models.SET_NULL, null=True
    )
    file_path = models.FileField(upload_to="reports/", null=True, blank=True)
    file_size = models.BigIntegerField(default=0)
    
    # snapshot metrics at generation time
    total_logs = models.IntegerField(default=0)
    total_threats = models.IntegerField(default=0)
    critical_threats = models.IntegerField(default=0)
    top_attack_type = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.generated_at.date()})"
    
