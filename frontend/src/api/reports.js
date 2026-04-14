import api from "./axios";

export const generateReport = (payload) =>
  api.post("reports/", payload).then((r) => r.data);

export const getReports = () => api.get("reports/").then((r) => r.data);

function extensionFromContentType(ct) {
  if (!ct || typeof ct !== "string") return null;
  const c = ct.toLowerCase();
  if (c.includes("application/pdf")) return "pdf";
  if (c.includes("text/csv")) return "csv";
  if (c.includes("application/json")) return "json";
  if (c.includes("text/plain")) return "txt";
  return null;
}

function extensionFromFormatHint(formatHint) {
  const f = (formatHint || "json").toLowerCase();
  if (f === "pdf") return "pdf";
  if (f === "csv") return "csv";
  return "json";
}

/**
 * Triggers browser download of the generated report file.
 */
export async function downloadReportFile(id, formatHint = "json") {
  try {
    const res = await api.get(`reports/${id}/download/`, {
      responseType: "blob",
    });
    const blob = res.data;

    const ct = res.headers["content-type"] || res.headers["Content-Type"] || "";
    const extFromCt = extensionFromContentType(ct);
    const fallbackExt = extensionFromFormatHint(formatHint);
    let filename = `sentinel_report_${id}.${extFromCt || fallbackExt}`;
    const cd = res.headers["content-disposition"] || res.headers["Content-Disposition"];
    if (cd && cd.includes("filename=")) {
      const part = cd.split("filename=")[1]?.trim().replace(/^"|"$/g, "");
      if (part) filename = part;
    } else if (extFromCt) {
      // Backend may send .txt when PDF fallback; CORS must expose Content-Disposition,
      // otherwise match filename extension to real Content-Type.
      filename = `sentinel_report_${id}.${extFromCt}`;
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    const data = error.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        const msg = parsed.error || parsed.detail || "Download failed";
        error.friendlyMessage = msg;
      } catch {
        error.friendlyMessage =
          error.message || "Download failed";
      }
    }
    throw error;
  }
}
