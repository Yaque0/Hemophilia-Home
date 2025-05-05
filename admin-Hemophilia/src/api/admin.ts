import request from "@/utils/request";

export const getAdminApi = () => {
  const instance = request.create({
    baseURL: "http://localhost:3000/api/admin",
  });

  // 添加管理员权限校验
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};
