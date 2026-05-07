import api from "./axios";

export const register = (data) =>
  api.post("auth/register/", data).then((r) => r.data);

export const checkAvailability = (params) =>
  api.get("auth/check-availability/", { params }).then((r) => r.data);

export const login = (data) =>
  api.post("auth/login/", data).then((r) => r.data);

export const logout = (refresh) =>
  api.post("auth/logout/", { refresh }).then((r) => r.data);

export const refreshToken = (refresh) =>
  api.post("auth/refresh/", { refresh }).then((r) => r.data);

export const getMe = () => api.get("auth/me/").then((r) => r.data);

export const getPendingUsers = () => api.get("auth/pending/").then((r) => r.data);

export const approveUser = (userId, approved) => 
  api.post(`auth/approve/${userId}/`, { approved }).then((r) => r.data);
