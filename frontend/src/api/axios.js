import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//Request interceptor token attached
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
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
//Handle 401  - try refresh, else redirect to login page
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRequest =
      original.url.includes("auth/login") ||
      original.url.includes("auth/register") ||
      original.url.includes("auth/refresh");

    if (error.response?.status === 401 && !original._retry && !isAuthRequest) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/auth/refresh/",
            { refresh },
          );
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          original.headers["Authorization"] = `Bearer ${res.data.access}`;
          return api(original); //retry original request
        } catch (_) {
          //refresh failed - clear tokens and redirect
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    const status = error.response?.status;
    let message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "An Unexpected error occurred";

    // Standardize invalid credential message
    if (status === 401 && isAuthRequest) {
      message = "Invalid credentials";
    }

    if (import.meta.env.DEV) {
      console.error(`x ${status} - ${message}`);
    }

    // Attach  clean message to the error for components to use
    error.friendlyMessage = message;
    return Promise.reject(error);
  },
);

export default api;
