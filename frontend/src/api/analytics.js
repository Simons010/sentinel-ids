import api from "./axios";
export const getAnalytics = () => api.get("analytics/").then((r) => r.data);
