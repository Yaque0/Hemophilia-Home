import request from "@/utils/request";

import type { User, UpdateUserInfo, UpdatePasswordData } from "@/types/user";
// ... 其余代码保持不变 ...

// 用户信息类型

// 获取当前用户信息
export const getUserProfile = () => {
  return request.get<{ user: User }>("/users/profile");
};

// 更新用户信息
export const updateUserProfile = (data: UpdateUserInfo) => {
  return request.put("/users/profile", data);
};

// 修改密码
export const updatePassword = (data: UpdatePasswordData) => {
  return request.put("/users/password", data);
};

// 注销账号（逻辑删除）
export const deleteAccount = () => {
  return request.delete("/users/delete");
};
