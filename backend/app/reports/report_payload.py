"""
Per-report-type metrics and chart payloads.

Each type uses different slices of logs/alerts so exports and UI are not identical.
"""
from __future__ import annotations

from django.db.models import Avg, Count

from app.reports.weekly import weekly_log_activity_buckets

VALID_REPORT_TYPES = frozenset(
    {"threat_summary", "log_activity", "network_security", "ai_performance"},
)


def normalize_report_type(raw: str) -> str:
    s = (raw or "threat_summary").strip().lower().replace("-", "_")
    aliases = {"ai_detection": "ai_performance"}
    return aliases.get(s, s)


def _pie_rows(rows: list[dict], label_key: str) -> list[dict]:
    """Normalize to {attack_type, count} for API/chart compatibility."""
    out = []
    for r in rows:
        label = r.get(label_key)
        if label is None or label == "":
            label = "—"
        out.append({"attack_type": str(label), "count": r["count"]})
    return out


def build_report_snapshot(
    report_type: str,
    logs,
    alerts,
    start_dt,
    end_dt,
    *,
    threshold: float = 0.5,
) -> tuple[dict, dict]:
    """
    Returns (snapshot_dict, overrides_for_report_model).
    overrides_for_report_model may include top_attack_type.
    """
    total_logs = logs.count()
    total_threats = alerts.count()
    critical_threats = alerts.filter(severity="critical").count()

    top_ip_row = (
        alerts.exclude(log__src_ip=None)
        .values("log__src_ip")
        .annotate(c=Count("id"))
        .order_by("-c")
        .first()
    )
    top_attacking_ip = (
        str(top_ip_row["log__src_ip"])
        if top_ip_row and top_ip_row.get("log__src_ip")
        else None
    )

    tp = logs.filter(is_suspicious=True, ml_score__gte=threshold).count()
    tn = logs.filter(is_suspicious=False, ml_score__lt=threshold).count()
    fp = logs.filter(is_suspicious=False, ml_score__gte=threshold).count()
    fn = logs.filter(is_suspicious=True, ml_score__lt=threshold).count()
    total_classified = tp + tn + fp + fn or 1
    accuracy = round((tp + tn) / total_classified * 100, 1)
    suspicious_log_count = logs.filter(is_suspicious=True).count()
    clean_log_count = logs.filter(is_suspicious=False).count()

    base_tail = {
        "top_attacking_ip": top_attacking_ip,
        "detection_accuracy": accuracy,
        "suspicious_log_count": suspicious_log_count,
        "clean_log_count": clean_log_count,
    }

    if report_type == "threat_summary":
        rows = list(
            alerts.values("attack_type")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )
        threat_distribution = _pie_rows(rows, "attack_type")
        weekly_activity = weekly_log_activity_buckets(start_dt, end_dt, alerts)
        top_attack_type = threat_distribution[0]["attack_type"] if threat_distribution else None
        snapshot = {
            **base_tail,
            "distribution_title": "Threats by attack type",
            "weekly_title": "New alerts per period",
            "threat_distribution": threat_distribution,
            "weekly_activity": weekly_activity,
        }

    elif report_type == "log_activity":
        rows = list(
            logs.exclude(event_type__isnull=True)
            .exclude(event_type="")
            .values("event_type")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )
        label_key = "event_type"
        if not rows:
            rows = list(
                logs.exclude(log_type__isnull=True)
                .exclude(log_type="")
                .values("log_type")
                .annotate(count=Count("id"))
                .order_by("-count")[:5]
            )
            label_key = "log_type"
        threat_distribution = _pie_rows(rows, label_key)
        weekly_activity = weekly_log_activity_buckets(start_dt, end_dt, logs)
        top_l = threat_distribution[0]["attack_type"] if threat_distribution else None
        top_attack_type = f"Top event: {top_l}" if top_l else None
        snapshot = {
            **base_tail,
            "distribution_title": "Log volume by event / log type",
            "weekly_title": "Logs ingested per period",
            "threat_distribution": threat_distribution,
            "weekly_activity": weekly_activity,
        }

    elif report_type == "network_security":
        net_logs = logs.exclude(src_ip__isnull=True)
        rows = list(
            net_logs.exclude(protocol__isnull=True)
            .exclude(protocol="")
            .values("protocol")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )
        label_key = "protocol"
        if not rows:
            rows = list(
                net_logs.exclude(service__isnull=True)
                .exclude(service="")
                .values("service")
                .annotate(count=Count("id"))
                .order_by("-count")[:5]
            )
            label_key = "service"
        threat_distribution = _pie_rows(rows, label_key)
        weekly_activity = weekly_log_activity_buckets(start_dt, end_dt, net_logs)
        unique_src = net_logs.values("src_ip").distinct().count()
        top_l = threat_distribution[0]["attack_type"] if threat_distribution else None
        top_attack_type = f"Top protocol/service: {top_l}" if top_l else None
        snapshot = {
            **base_tail,
            "distribution_title": "Network traffic by protocol or service",
            "weekly_title": "Logs with source IP per period",
            "threat_distribution": threat_distribution,
            "weekly_activity": weekly_activity,
            "unique_source_ips": unique_src,
        }

    else:  # ai_performance
        scores = list(logs.values_list("ml_score", flat=True))
        bounds = [(0.0, 0.25), (0.25, 0.5), (0.5, 0.75), (0.75, 1.000001)]
        labels = [
            "ML score 0.00–0.25",
            "ML score 0.25–0.50",
            "ML score 0.50–0.75",
            "ML score 0.75–1.00",
        ]
        counts = [0, 0, 0, 0]
        for raw in scores:
            s = float(raw) if raw is not None else 0.0
            for i, (lo, hi) in enumerate(bounds):
                if lo <= s < hi:
                    counts[i] += 1
                    break
        threat_distribution = [
            {"attack_type": labels[i], "count": counts[i]}
            for i in range(4)
            if counts[i] > 0
        ]
        suspicious_logs = logs.filter(is_suspicious=True)
        weekly_activity = weekly_log_activity_buckets(start_dt, end_dt, suspicious_logs)
        avg_score = logs.aggregate(avg=Avg("ml_score"))["avg"] or 0.0
        top_attack_type = f"Avg ML score: {float(avg_score):.3f}"
        snapshot = {
            **base_tail,
            "distribution_title": "ML score distribution (all logs in range)",
            "weekly_title": "Suspicious logs flagged per period",
            "threat_distribution": threat_distribution,
            "weekly_activity": weekly_activity,
            "true_positives": tp,
            "false_positives": fp,
            "true_negatives": tn,
            "false_negatives": fn,
        }

    overrides = {"top_attack_type": top_attack_type}
    return snapshot, overrides
