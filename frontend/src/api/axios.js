import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  const protocol = window.location.protocol;
  const { hostname } = window.location;
  
  // If hostname is a Docker internal IP (172.x.x.x range), fall back to localhost
  const isDockerInternalIP = /^172\.\d+\.\d+\.\d+$/.test(hostname);
  const safeHost = isDockerInternalIP ? "localhost" : hostname;

  return `${protocol}//${hostname}:8000/api/`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Host rotation for API fallbacks
const API_HOSTS = ["localhost", "127.0.0.1", window.location.hostname,];
let currentHostIndex = 0;

const rotateApiHost = (config) => {
  currentHostIndex = (currentHostIndex + 1) % API_HOSTS.length;
  const nextHost = API_HOSTS[currentHostIndex];
  const protocol = window.location.protocol;
  const newBaseURL = `${protocol}//${nextHost}:8000/api/`;

  console.warn(`[API] Switching to fallback host: ${newBaseURL}`);

  // Update instance defaults so future requests use this host
  api.defaults.baseURL = newBaseURL;

  // Update the current request's baseURL
  config.baseURL = newBaseURL;

  return config;
};

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

    // Handle Network Errors by rotating host
    // Axios throws a "Network Error" without a response for refused connections
    if (!error.response && currentHostIndex < API_HOSTS.length - 1) {
      console.warn(
        `[API] Network error detected, attempting host rotation. Current host index: ${currentHostIndex}`,
      );
      const updatedConfig = rotateApiHost(original);

      // Fix: Ensure the request is retried with the new baseURL
      // We must reset the URL to the relative path so it uses the new baseURL
      if (updatedConfig.url && updatedConfig.url.startsWith("http")) {
        try {
          const urlObj = new URL(updatedConfig.url);
          // If the URL is absolute and contains the old host, strip it to relative
          updatedConfig.url = urlObj.pathname + urlObj.search;
        } catch (e) {
          // If URL parsing fails, try a simple split/fallback
          console.warn(
            "[API] Could not parse absolute URL during rotation, attempting fallback",
          );
        }
      }

      // Force axios to re-calculate the request from scratch with the new baseURL
      // Using the main api instance to ensure other interceptors (auth) are applied
      return api.request(updatedConfig);
    }

    if (!error.response) {
      console.error(
        "[API] Final network error after all rotation attempts:",
        error.message,
      );
    }

    const isAuthRequest =
      original.url.includes("auth/login") ||
      original.url.includes("auth/register") ||
      original.url.includes("auth/refresh");

    if (error.response?.status === 401 && !original._retry && !isAuthRequest) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const res = await axios.post(`${getBaseURL()}auth/refresh/`, {
            refresh,
          });
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
