import request from "@/utils/request";
import type { LoginData, RegisterData } from "@/types/auth";

//登录
export const login = (data: LoginData) => {
  return request.post("/auth/login", data);
};
//注册
export const register = (data: RegisterData) => {
  return request.post("/auth/register", data);
};
export const getCurrentUser = () => {
  return request.get("/auth/getCurrentUser");
};
