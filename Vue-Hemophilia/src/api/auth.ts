import request from "@/utils/request";

// 登录数据
export interface LoginData {
  email: string;
  password: string;
}

// 注册数据
export interface RegisterData {
  email: string;
  password: string;
  username: string;
  phone?: string;
}

//登录
export const login = (data: LoginData) => {
  return request.post("/auth/login", data);
};
//注册
export const register = (data: RegisterData) => {
  return request.post("/auth/register", data);
};
