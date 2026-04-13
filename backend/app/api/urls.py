from django.urls import path
from app.api.views import AlertListView, AnalyticsView, DashboardStatsView, LogIngestView, LogUploadView, NetworkStatsView, ReportView, ReportDownloadView, SettingsView, ThreatsStatsView, IntegrationApiKeysView, IntegrationApiKeyDetailView, TeamMembersView, TeamMemberDetailView

urlpatterns = [
    path('ingest/', LogIngestView.as_view(), name='log-ingestion'),
    path('alerts/', AlertListView.as_view(), name='alerts'),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('network/', NetworkStatsView.as_view(), name='network-stats'),
    path('upload/', LogUploadView.as_view(), name= 'upload-logs'),
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
