from django.contrib import admin
from app.reports.models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('generated_at', 'report_type', 'format', 'name', 'generated_by')
    search_fields = ('report_type', 'generated_at')
