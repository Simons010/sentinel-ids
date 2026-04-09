import api from "./axios";

export const getThreatsStats = () => api.get("threats/").then((r) => r.data);

export const getAlerts = (params) =>
  api.get("alerts/", { params }).then((r) => r.data);
