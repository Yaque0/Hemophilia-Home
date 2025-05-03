import { Request, Response } from "express";
import User from "../models/user.model";
import { Op } from "sequelize";

export class AdminController {
  // 获取用户列表（带分页和筛选）
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, role, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (search) where.username = { [Op.like]: `%${search}%` };
      if (role) where.role = role;
      if (status) where.status = status;

      const { count, rows: users } = await User.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        users,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ message: "获取用户列表失败" });
    }
  }

  // 更新用户角色和状态
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role, status } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ message: "用户不存在" });
        return;
      }

      if (role) user.role = role;
      if (status) user.status = status;
      await user.save();

      res.json({ message: "更新成功", user });
    } catch (error) {
      res.status(500).json({ message: "更新用户失败" });
    }
  }
}
