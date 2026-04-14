import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//Request interceptor
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `-> ${config.method?.toUpperCase()} ${config.url}`,
        config.data || "",
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "An Unexpected error occurred";

    if (import.meta.env.DEV) {
      console.error(`x ${status} - ${message}`);
    }

    // Attach  clean message to the error for components to use
    error.friendlyMessage = message;
    return Promise.reject(error);
  },
);

export default api;
