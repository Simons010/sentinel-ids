from django.db import models

# settings model
class SystemSetting(models.Model):
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE, null=True, blank=True)
    
    # Notifications
    email_alerts = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=False)
    slack_integration = models.BooleanField(default=False)
    sms_alerts = models.BooleanField(default=False)
    
    # Security
    two_factor_auth = models.BooleanField(default=False)
    auto_block_threats = models.BooleanField(default=False)
    ip_whitelisting = models.BooleanField(default=False)
    session_timeout = models.IntegerField(default=30)  # in minutes
    
    # Database Retention
    retention_days = models.IntegerField(default=90)
    archive_location = models.CharField(max_length=255, default="/var/log/sentinel-ids/archives")
    auto_archive = models.BooleanField(default=True)
    
    # AI Model
    ai_model_mode = models.CharField(
        max_length=20, 
        choices=[("standard", "Standard"), ("advanced", "Advanced"), ("deep", "Deep Learning")],
        default="advanced",
    )
    continuous_learning = models.BooleanField(default=True)
    ai_sensitivity = models.IntegerField(default=85)  # 0-100 scale

    # Email configuration
    smtp_server = models.CharField(max_length=255, blank=True, default="")
    smtp_port = models.IntegerField(default=587)
    smtp_username = models.CharField(max_length=255, blank=True, default="")
    smtp_password = models.CharField(max_length=255, blank=True, default="")
    
    def __str__(self):
        return f"Settings for {self.user}" 
    