import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

//请求拦截器
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || "请求失败");
    return Promise.reject(error);
  },
);
export default request;
