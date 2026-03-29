from django.db import models

# network log model to store parsed logs
class NetworkLog(models.Model):
    session_id = models.UUIDField(null=True, blank=True, db_index=True)  # group batch logs
    sequence_index = models.IntegerField(null=True, blank=True)  # order within batch
    
    # Syslog parsed fields
    timestamp = models.DateTimeField(null=True, blank=True)  
    host = models.CharField(max_length=255, null=True, blank=True)
    process = models.CharField(max_length=100, null=True, blank=True)
    pid = models.IntegerField(null=True, blank=True)
    
    # Network fields
    src_ip = models.GenericIPAddressField(null=True, blank=True)
    dst_ip = models.GenericIPAddressField(null=True, blank=True)
    src_port = models.IntegerField(null=True, blank=True)
    dst_port = models.IntegerField(null=True, blank=True)
    
    protocol = models.CharField(max_length=20, null=True, blank=True)
    service = models.CharField(max_length=50, null=True, blank=True)
    event_type = models.CharField(max_length=50, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    raw_log = models.TextField(null=True, blank=True)  # ← original unparsed log  
    
    # ML/Detection Results 
    ml_score = models.FloatField(default=0.0)
    is_suspicious = models.BooleanField(default=False)
    log_type = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.timestamp} - {self.src_ip} - Suspicious: {self.is_suspicious}"
    
# upload file model   
class UploadedFile(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),     
        ("failed", "Failed"),
    ]
    
    file = models.FileField(upload_to="log_uploads/")
    filename = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    upload_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_logs = models.IntegerField(default=0)
    valid_logs = models.IntegerField(default=0)
    invalid_logs = models.IntegerField(default=0)
    parse_errors = models.IntegerField(default=0)
    threats_found = models.IntegerField(default=0)
    clean_logs = models.IntegerField(default=0)
    error_message = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.filename} ({self.file_size} bytes) - Status: {self.status}"
    
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
    top_attack_type = models.CharField(max_lenth=100, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.generated_at.date()})"
    