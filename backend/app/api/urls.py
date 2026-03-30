from django.urls import path
from app.api.views import AlertListView, AnalyticsView, DashboardStatsView, LogIngestView, LogUploadView, NetworkStatsView, ReportView, SettingsView

urlpatterns = [
    path('ingest/', LogIngestView.as_view(), name='log-ingestion'),
    path('alerts/', AlertListView.as_view(), name='alerts'),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('network/', NetworkStatsView.as_view(), name='network-stats'),
    path('upload/', LogUploadView.as_view(), name= 'upload-logs'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('reports/', ReportView.as_view(), name= 'reports'),
    path('settings/', SettingsView.as_view(), name= 'settings'),
]
