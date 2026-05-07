import axios from "./axios";

export const getLogs = async ({ page = 1, search = "" }) => {
  try {
    const response = await axios.get("/logs/", {
      params: { page, search },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAlerts = async ({ page = 1, search = "" }) => {
  try {
    const response = await axios.get("/alerts/", {
      params: { page, search },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
