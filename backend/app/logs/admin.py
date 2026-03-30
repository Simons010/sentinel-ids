from django.contrib import admin
from app.logs.models import NetworkLog, UploadedFile

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

