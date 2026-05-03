import axios from "axios";
import { store } from "../store";
import { RefreshToken, Logout } from "../features/userSlice";
import { navigateTo } from "../utils/navigationHelper"; // ← NEW

const axiosInstance = axios.create({
  baseURL: "https://localhost:7259",
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────
// REQUEST INTERCEPTOR
// Adds token to every request automatically
// ─────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().users.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

// ─────────────────────────────────────────
// RESPONSE INTERCEPTOR
// ─────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.log("❌ Error:", status, error.config?.url);

    // ─────────────────────────────────────────
    // 403 = user is logged in but wrong role
    // Do NOT logout — just go to forbidden page
    // ─────────────────────────────────────────
    if (status === 403) {
      // ✅ Use navigateTo instead of window.location.href
      navigateTo("/Forbidden");
      return Promise.reject(error);
    }

    // ─────────────────────────────────────────
    // 401 = token expired → try to refresh
    // ─────────────────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        store.dispatch(Logout());
        // ✅ Use navigateTo instead of window.location.href
        navigateTo("/Login");
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result = await store.dispatch(RefreshToken());

        if (RefreshToken.fulfilled.match(result)) {
          // ✅ Refresh worked — retry original request
          const newAccessToken = result.payload.accessToken;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          // ❌ Refresh failed — logout and go to login
          isRefreshing = false;
          store.dispatch(Logout());
          // ✅ Use navigateTo instead of window.location.href
          navigateTo("/Login");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        store.dispatch(Logout());
        // ✅ Use navigateTo instead of window.location.href
        navigateTo("/Login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
