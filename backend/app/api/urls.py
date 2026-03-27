from django.urls import path
from .views import LogIngestView
from .views import AlertListView
from .views import DashboardStatsView

urlpatterns = [
    path('ingest/', LogIngestView.as_view(), name='log-ingestion'),
    path('alerts/', AlertListView.as_view(), name='alerts'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
