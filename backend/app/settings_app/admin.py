from django.contrib import admin
from backend.app.settings_app.models import SystemSettings

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "email_alerts",
        "push_notifications",
        "slack_integration",
        "sms_alerts",
        "two_factor_auth",
        "auto_block_threats",
        "ip_whitelisting",
        "session_timeout",
        "retention_days",
        "auto_archive",
        "ai_model_mode",
        "continuous_learning",
        "ai_sensitivity",
    )
    list_filter = ("email_alerts", "push_notifications", "slack_integration", "sms_alerts", "two_factor_auth", "auto_block_threats", "ip_whitelisting", "auto_archive", "continuous_learning",)
    search_fields = ("user__username",)
