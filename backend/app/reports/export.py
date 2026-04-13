"""Build downloadable report files (JSON, CSV, PDF) from a Report instance."""
from __future__ import annotations

import logging
import os
import csv
import io
import json
import re
from typing import Any

from django.conf import settings
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)


def _safe_filename(name: str) -> str:
    return re.sub(r"[^\w\-.]+", "_", (name or "report").strip())[:120] or "report"


def build_export_payload(report) -> dict[str, Any]:
    snap = report.snapshot if isinstance(report.snapshot, dict) else {}
    return {
        "id": report.id,
        "name": report.name,
        "report_type": report.report_type,
        "format": report.format,
        "start_date": report.start_date.isoformat() if report.start_date else None,
        "end_date": report.end_date.isoformat() if report.end_date else None,
        "generated_at": report.generated_at.isoformat() if report.generated_at else None,
        "total_logs": report.total_logs,
        "total_threats": report.total_threats,
        "critical_threats": report.critical_threats,
        "top_attack_type": report.top_attack_type,
        "top_attacking_ip": snap.get("top_attacking_ip"),
        "threat_distribution": snap.get("threat_distribution") or [],
        "weekly_activity": snap.get("weekly_activity") or [],
        "detection_accuracy": snap.get("detection_accuracy"),
    }


def _csv_bytes(payload: dict[str, Any]) -> bytes:
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["field", "value"])
    for key in (
        "total_logs",
        "total_threats",
        "critical_threats",
        "top_attack_type",
        "detection_accuracy",
        "top_attacking_ip",
    ):
        w.writerow([key, payload.get(key)])
    w.writerow([])
    w.writerow(["threat_distribution"])
    w.writerow(["attack_type", "count"])
    for row in payload.get("threat_distribution") or []:
        w.writerow([row.get("attack_type"), row.get("count")])
    w.writerow([])
    w.writerow(["weekly_activity"])
    w.writerow(["time", "logs"])
    for row in payload.get("weekly_activity") or []:
        w.writerow([row.get("time"), row.get("logs")])
    return buf.getvalue().encode("utf-8")


def _pdf_safe_text(val: Any) -> str:
    """Helvetica core fonts only support Latin-1; avoid FPDF encode crashes."""
    if val is None:
        return ""
    return str(val).encode("latin-1", errors="replace").decode("latin-1")


def _build_pdf_bytes(payload: dict[str, Any]) -> bytes:
    from fpdf import FPDF

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(
        0,
        6,
        txt=_pdf_safe_text(payload.get("name") or "Security report"),
    )
    pdf.ln(2)
    pdf.set_font("Helvetica", size=10)
    summary = (
        f"Period: {payload.get('start_date')} – {payload.get('end_date')}\n"
        f"Total logs: {payload.get('total_logs')}\n"
        f"Total threats: {payload.get('total_threats')}\n"
        f"Critical: {payload.get('critical_threats')}\n"
        f"Top attack: {payload.get('top_attack_type')}\n"
        f"Top IP: {payload.get('top_attacking_ip')}\n"
        f"Detection accuracy: {payload.get('detection_accuracy')}%"
    )
    pdf.multi_cell(0, 5, txt=_pdf_safe_text(summary))
    pdf.ln(4)
    pdf.set_font("Helvetica", style="B", size=10)
    pdf.multi_cell(0, 6, txt="Threat distribution")
    pdf.set_font("Helvetica", size=10)
    for row in payload.get("threat_distribution") or []:
        line = f"  {row.get('attack_type')}: {row.get('count')}"
        pdf.multi_cell(0, 5, txt=_pdf_safe_text(line))
    pdf.ln(2)
    pdf.set_font("Helvetica", style="B", size=10)
    pdf.multi_cell(0, 6, txt="Weekly log activity")
    pdf.set_font("Helvetica", size=10)
    for row in payload.get("weekly_activity") or []:
        line = f"  {row.get('time')}: {row.get('logs')} logs"
        pdf.multi_cell(0, 5, txt=_pdf_safe_text(line))
    try:
        out = pdf.output(dest="S")
    except TypeError:
        out = pdf.output()
    if isinstance(out, str):
        out = out.encode("latin-1", errors="replace")
    elif not isinstance(out, (bytes, bytearray)):
        out = bytes(out)
    else:
        out = bytes(out)
    return out.lstrip()


def _render_pdf_output(payload: dict[str, Any]) -> tuple[bytes, str, str]:
    """
    Return (bytes, content_type, extension). On any failure, fall back to UTF-8 text
    so the user always gets a downloadable file (browser PDF viewer requires real %PDF).
    """
    try:
        raw = _build_pdf_bytes(payload)
        if not raw.lstrip().startswith(b"%PDF"):
            raise ValueError("Generator did not produce a PDF signature")
        return raw, "application/pdf", ".pdf"
    except Exception as exc:
        logger.warning("PDF export failed, using UTF-8 text fallback: %s", exc)
        body = _pdf_fallback_bytes(payload)
        return body, "text/plain; charset=utf-8", ".txt"


def _pdf_fallback_bytes(payload: dict[str, Any]) -> bytes:
    """Structured plain-text report when PDF is unavailable or fails."""
    lines = [
        str(payload.get("name") or "Security report"),
        "",
        f"Period: {payload.get('start_date')} – {payload.get('end_date')}",
        f"Total logs: {payload.get('total_logs')}",
        f"Total threats: {payload.get('total_threats')}",
        "",
        "Threat distribution:",
    ]
    for row in payload.get("threat_distribution") or []:
        lines.append(f"  - {row.get('attack_type')}: {row.get('count')}")
    lines.append("")
    lines.append("Weekly log activity:")
    for row in payload.get("weekly_activity") or []:
        lines.append(f"  - {row.get('time')}: {row.get('logs')}")
    note = (
        "\n\n---\n"
        "Note: PDF generation failed or fpdf2 is not installed. "
        "Install fpdf2 (pip install fpdf2) for binary PDF downloads."
    )
    lines.append(note)
    return "\n".join(lines).encode("utf-8")


def render_report_file_bytes(report) -> tuple[bytes, str, str]:
    """
    Returns (content_bytes, content_type, file_extension_with_dot).
    """
    payload = build_export_payload(report)
    fmt = (report.format or "json").lower()

    if fmt == "json":
        raw = json.dumps(payload, indent=2, default=str).encode("utf-8")
        return raw, "application/json", ".json"
    if fmt == "csv":
        return _csv_bytes(payload), "text/csv; charset=utf-8", ".csv"
    if fmt == "pdf":
        return _render_pdf_output(payload)
    raw = json.dumps(payload, indent=2, default=str).encode("utf-8")
    return raw, "application/json", ".json"


def save_report_file(report) -> None:
    """Write bytes to report.file_path and set file_size."""
    media_root = getattr(settings, "MEDIA_ROOT", None)
    if media_root:
        os.makedirs(str(media_root), exist_ok=True)
    content, _ctype, ext = render_report_file_bytes(report)
    size = len(content)
    base = _safe_filename(f"{report.id}_{report.name}")
    fname = f"{base}{ext}"
    try:
        report.file_path.save(fname, ContentFile(content), save=False)
        report.file_size = size
        report.save(update_fields=["file_path", "file_size"])
    except Exception as exc:
        logger.exception("Failed to persist report file to storage: %s", exc)
        report.file_size = size
        report.save(update_fields=["file_size"])
