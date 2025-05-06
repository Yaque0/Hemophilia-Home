import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { ElMessage } from "element-plus";
import { jwtDecode as jwt_decode } from "jwt-decode";
const request = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

//请求拦截器
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      console.log("Token:", authStore.token);
      // 解码token检查是否过期
      const decoded: any = (jwt_decode as any)(authStore.token);
      if (decoded.exp * 1000 < Date.now()) {
        authStore.logout();
        window.location.href = "/login";
        return Promise.reject(new Error("Token已过期"));
      }

      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    // 401 未授权
    if (error.response?.status === 401 && !originalRequest._retry) {
      authStore.logout();
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return Promise.reject(error);
    }

    // 403 禁止访问
    if (error.response?.status === 403) {
      ElMessage.error("无权限访问");
      return Promise.reject(error);
    }

    // 其他错误
    ElMessage.error(error.response?.data?.message || "请求失败");
    return Promise.reject(error);
  },
);
export default request;
