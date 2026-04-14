"""
Split [start_date, end_date] into four contiguous buckets (by calendar days).

Uses inclusive datetime ranges in the active timezone instead of `_evt__date` filters
on annotated querysets (unreliable on some DBs / timezones).
"""
from datetime import date, datetime, time, timedelta

from django.utils import timezone


def weekly_log_activity_buckets(
    start_dt: date,
    end_dt: date,
    logs_qs,
) -> list[dict]:
    """
    Return [{"time": "Week 1", "logs": n}, ...] covering every day in the range once.

    `logs_qs` must be annotated with `_evt` (datetime) from logs_for_report_range.
    """
    if start_dt > end_dt:
        return [{"time": f"Week {i+1}", "logs": 0} for i in range(4)]

    n_days = (end_dt - start_dt).days + 1
    n_days = max(1, n_days)
    base, rem = divmod(n_days, 4)

    out: list[dict] = []
    cursor = start_dt
    for i in range(4):
        seg_len = base + (1 if i < rem else 0)
        if seg_len <= 0 or cursor > end_dt:
            out.append({"time": f"Week {i+1}", "logs": 0})
            continue

        week_end_inclusive = cursor + timedelta(days=seg_len - 1)
        if week_end_inclusive > end_dt:
            week_end_inclusive = end_dt

        lo = timezone.make_aware(datetime.combine(cursor, time.min))
        hi = timezone.make_aware(datetime.combine(week_end_inclusive, time.max))

        count = logs_qs.filter(_evt__gte=lo, _evt__lte=hi).count()
        out.append({"time": f"Week {i+1}", "logs": count})
        cursor = week_end_inclusive + timedelta(days=1)

    return out
