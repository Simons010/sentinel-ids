import api from "./axios";
export const getAlerts = (params) =>
  api.get("alerts/", { params }).then((r) => r.data);
