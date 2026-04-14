import api from "./axios";

export const getSettings = () => api.get("settings/").then((r) => r.data);

export const updateSettings = (payload) =>
  api.patch("settings/", payload).then((r) => r.data);

export const getApiKeys = () =>
  api.get("settings/api-keys/").then((r) => r.data);

export const createApiKey = (payload) =>
  api.post("settings/api-keys/", payload).then((r) => r.data);

export const revokeApiKey = (id) =>
  api.delete(`settings/api-keys/${id}/`).then((r) => r.data);

export const getTeamMembers = () =>
  api.get("settings/team-members/").then((r) => r.data);

export const createTeamMember = (payload) =>
  api.post("settings/team-members/", payload).then((r) => r.data);

export const updateTeamMember = (id, payload) =>
  api.patch(`settings/team-members/${id}/`, payload).then((r) => r.data);
