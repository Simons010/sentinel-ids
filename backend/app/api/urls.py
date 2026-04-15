from django.urls import path
from app.api.views import AlertListView, AnalyticsView, DashboardStatsView, LogIngestView, LogUploadView, LogUploadDetailView, LogUploadPreviewView, LogUploadAnalyzeView, LogUploadMarkFailedView, NetworkStatsView, ReportView, ReportDownloadView, SettingsView, ThreatsStatsView, IntegrationApiKeysView, IntegrationApiKeyDetailView, TeamMembersView, TeamMemberDetailView

urlpatterns = [
    path('ingest/', LogIngestView.as_view(), name='log-ingestion'),
    path('alerts/', AlertListView.as_view(), name='alerts'),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('network/', NetworkStatsView.as_view(), name='network-stats'),
    path('upload/', LogUploadView.as_view(), name= 'upload-logs'),
    path('upload/<int:upload_id>/', LogUploadDetailView.as_view(), name='upload-detail'),
    path('upload/<int:upload_id>', LogUploadDetailView.as_view(), name='upload-detail-no-slash'),
    path('upload/delete/<int:upload_id>/', LogUploadDetailView.as_view(), name='upload-detail-flat'),
    path('upload/delete/<int:upload_id>', LogUploadDetailView.as_view(), name='upload-detail-flat-no-slash'),
    path('upload/<int:upload_id>/preview/', LogUploadPreviewView.as_view(), name='upload-preview'),
    path('upload/<int:upload_id>/analyze/', LogUploadAnalyzeView.as_view(), name='upload-analyze'),
    path('upload/<int:upload_id>/mark-failed/', LogUploadMarkFailedView.as_view(), name='upload-mark-failed'),
    # Compatibility aliases (with/without nested style and trailing slash variance)
    path('upload/<int:upload_id>/preview', LogUploadPreviewView.as_view(), name='upload-preview-no-slash'),
    path('upload/<int:upload_id>/analyze', LogUploadAnalyzeView.as_view(), name='upload-analyze-no-slash'),
    path('upload/preview/<int:upload_id>/', LogUploadPreviewView.as_view(), name='upload-preview-flat'),
    path('upload/analyze/<int:upload_id>/', LogUploadAnalyzeView.as_view(), name='upload-analyze-flat'),
    path('upload/mark-failed/<int:upload_id>/', LogUploadMarkFailedView.as_view(), name='upload-mark-failed-flat'),
    path('upload/preview/<int:upload_id>', LogUploadPreviewView.as_view(), name='upload-preview-flat-no-slash'),
    path('upload/analyze/<int:upload_id>', LogUploadAnalyzeView.as_view(), name='upload-analyze-flat-no-slash'),
    path('upload/mark-failed/<int:upload_id>', LogUploadMarkFailedView.as_view(), name='upload-mark-failed-flat-no-slash'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('reports/', ReportView.as_view(), name= 'reports'),
    path('reports/<int:pk>/download/', ReportDownloadView.as_view(), name='report-download'),
    path('settings/', SettingsView.as_view(), name= 'settings'),
    path('settings/api-keys/', IntegrationApiKeysView.as_view(), name='settings-api-keys'),
    path('settings/api-keys/<int:key_id>/', IntegrationApiKeyDetailView.as_view(), name='settings-api-key-detail'),
    path('settings/team-members/', TeamMembersView.as_view(), name='settings-team-members'),
    path('settings/team-members/<int:member_id>/', TeamMemberDetailView.as_view(), name='settings-team-member-detail'),
    path("threats/", ThreatsStatsView.as_view(), name="threats")
]
