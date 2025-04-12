import request from "@/utils/request";

// 用户信息类型
export interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: string;
  phone?: string;
  avatar?: string;
}

// 修改用户信息数据
export interface UpdateUserInfo {
  username?: string;
  phone?: string;
  avatar?: string;
}

// 修改密码数据
export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

// 获取当前用户信息
export const getUserProfile = () => {
  return request.get<{ user: UserInfo }>("/users/profile");
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
