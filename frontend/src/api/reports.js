import api from "./axios";

export const generateReport = (payload) =>
  api.post("reports/", payload).then((r) => r.data);

export const getReports = () => api.get("reports/").then((r) => r.data);

/**
 * Triggers browser download of the generated report file.
 */
export async function downloadReportFile(id, formatHint = "json") {
  try {
    const res = await api.get(`reports/${id}/download/`, {
      responseType: "blob",
    });
    const blob = res.data;

    const ext =
      formatHint === "pdf" ? "pdf" : formatHint === "csv" ? "csv" : "json";
    let filename = `sentinel_report_${id}.${ext}`;
    const cd = res.headers["content-disposition"];
    if (cd && cd.includes("filename=")) {
      const part = cd.split("filename=")[1]?.trim().replace(/^"|"$/g, "");
      if (part) filename = part;
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
