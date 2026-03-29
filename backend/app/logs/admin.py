from django.contrib import admin
from .models import NetworkLog, Report, UploadedFile

@admin.register(NetworkLog)
class NetworkLogAdmin(admin.ModelAdmin):
    
    list_display = (
        'timestamp', 
        'host',
        'process',
        'src_ip', 
        'dst_ip', 
        'protocol', 
        'service', 
        'event_type',
        'message',
        'ml_score',
        'is_suspicious', 
        'log_type', 
    )

    search_fields = ('src_ip', 'dst_ip', 'protocol', 'service', 'timestamp', 'is_suspicious')
 
@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = (
        'filename', 
        'file_size', 
        'upload_at', 
        'status', 
        'total_logs', 
        'valid_logs', 
        'invalid_logs', 
        'threats_found'
    )
    search_fields = ('filename', 'status')

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('generated_at', 'report_type', 'description')
    search_fields = ('report_type', 'generated_at')