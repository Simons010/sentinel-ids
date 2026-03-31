import api from "./axios";

export const getSettings = () => api.get("settings/").then((r) => r.data);

export const updateSettings = (payload) =>
  api.patch("settings/", payload).then((r) => r.data);
