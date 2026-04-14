"""
Report date-range querysets.

Logs and alerts are filtered by *event* time when available:
- NetworkLog: Coalesce(timestamp, created_at) — parsed log time vs ingest time
- Alert: Coalesce(log.timestamp, created_at) — event time vs alert creation time

Using only created_at__date often yields zeros when timestamp holds the real event date
or when legacy rows have null created_at.
"""
from django.db.models import DateTimeField, F
from django.db.models.functions import Coalesce

from app.alerts.models import Alert
from app.logs.models import NetworkLog


def logs_for_report_range(start_at, end_at):
    """NetworkLog rows whose effective event time falls in [start_at, end_at] (inclusive)."""
    return (
        NetworkLog.objects.annotate(
            _evt=Coalesce(
                F("timestamp"),
                F("created_at"),
                output_field=DateTimeField(),
            )
        )
        .filter(_evt__isnull=False, _evt__gte=start_at, _evt__lte=end_at)
    )


def alerts_for_report_range(start_at, end_at):
    """Alerts whose linked log event time (or alert created_at) falls in [start_at, end_at]."""
    return (
        Alert.objects.select_related("log")
        .annotate(
            _evt=Coalesce(
                F("log__timestamp"),
                F("created_at"),
                output_field=DateTimeField(),
            )
        )
        .filter(_evt__isnull=False, _evt__gte=start_at, _evt__lte=end_at)
    )
