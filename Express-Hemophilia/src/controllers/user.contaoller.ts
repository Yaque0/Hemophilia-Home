// src/controllers/user.controller.ts
import { Request, Response } from "express";
import User from "../models/user.model";

// 定义类型保护来确保 req.user 是定义的
function isAuthenticated(req: Request): req is Request & { user: User } {
  return req.user != null;
}

export class UserController {
  // 获取用户信息
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!isAuthenticated(req)) {
        res.status(401).json({ message: "未授权" });
        return;
      }

      const user = req.user; // 这里 req.user 的类型已经被确定为 User

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("获取用户信息失败:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 个人信息更新
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!isAuthenticated(req)) {
        res.status(401).json({ message: "未授权" });
        return;
      }

      const user = req.user;
      const { username, phone, avatar } = req.body;
      user.username = username || user.username;
      user.phone = phone || user.phone;
      user.avatar = avatar || user.avatar;

      await user.save();

      res.json({
        message: "更新成功",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("更新失败:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 密码修改
  static async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!isAuthenticated(req)) {
        res.status(401).json({ message: "未授权" });
        return;
      }

      const user = req.user;
      const { oldPassword, newPassword } = req.body;

      if (!(await user.comparePassword(oldPassword))) {
        res.status(400).json({ message: "旧密码错误" });
        return;
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: "密码修改成功" });
    } catch (error) {
      console.error("密码修改失败:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 注销账户
  static async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!isAuthenticated(req)) {
        res.status(401).json({ message: "未授权" });
        return;
      }

      const user = req.user;
      user.status = 0; // 将账户设置为禁用状态
      await user.save();

      res.json({ message: "账户已注销" });
    } catch (error) {
      console.error("注销失败:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
}
