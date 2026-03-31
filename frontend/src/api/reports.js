import api from "./axios";

export const generateReport = (payload) =>
  api.post("reports/", payload).then((r) => r.data);

export const getReports = () => api.get("reports/").then((r) => r.data);
