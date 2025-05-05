export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  phone?: string;
  status?: number;
}

export interface UpdateUserInfo {
  username?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}
