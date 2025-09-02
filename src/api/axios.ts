import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else {
      if (token && p.config.headers) p.config.headers.Authorization = `Bearer ${token}`;
      p.resolve(api(p.config));
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfigWithRetry;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: original });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const r = await axios.post(
          new URL("auth/refresh/", import.meta.env.VITE_API_BASE_URL).toString(),
          { refresh }
        );
        const newAccess = (r.data as any).access;
        localStorage.setItem("access", newAccess);
        processQueue(null, newAccess);
        return api(original);
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
