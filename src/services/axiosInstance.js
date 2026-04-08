import axios from "axios";
import { APP_VERSION } from "../config/version";
import { versionModalHandler } from "../utils/versionModalHandler";

const axiosInstance = axios.create();

// ================= REQUEST INTERCEPTOR =================
axiosInstance.interceptors.request.use((config) => {
  // send frontend version with every API
  config.headers["version-code"] = APP_VERSION;

  return config;
});

// ================= RESPONSE INTERCEPTOR =================
axiosInstance.interceptors.response.use(
  (response) => {
    // 🔴 Version mismatch check
    if (response.data?.status === 0) {
      // show StatusModal
      versionModalHandler(response.data.message);

      // stop API execution so page code doesn't crash
      return new Promise(() => {});
    }

    return response;
  },

  (error) => {
    const message = error.response?.data?.message;

    // 🔴 Logout if account active on another device
    if (
      error.response?.status === 401 &&
      message === "Logged out: Account is active on another device"
    ) {
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
