import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user.model";

export class AuthController {
  // 用户注册
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, username, phone } = req.body;

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: "该邮箱已被注册" });
        return;
      }

      // 创建新用户
      const user = await User.create({
        email,
        password,
        username,
        phone,
        role: "user",
        status: 1,
      });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        message: "注册成功",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("注册错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 用户登录
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // 查找用户
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "邮箱或密码错误" });
        return;
      }

      // 验证密码
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        res.status(401).json({ message: "邮箱或密码错误" });
        return;
      }

      // 检查用户状态
      if (user.status !== 1) {
        res.status(403).json({ message: "账号已被禁用" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      res.json({
        message: "登录成功",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("登录错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      res.json({
        user: {
          id: user?.id,
          email: user?.email,
          username: user?.username,
          role: user?.role,
        },
      });
    } catch (error) {
      console.error("获取用户信息错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
}
