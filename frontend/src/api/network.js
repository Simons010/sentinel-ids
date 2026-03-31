import api from "./axios";
export const getNetworkStats = () => api.get("network/").then((r) => r.data);
