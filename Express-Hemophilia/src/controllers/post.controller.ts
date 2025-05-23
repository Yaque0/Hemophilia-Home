import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Post from "../models/post.model";
import User from "../models/user.model";
import Comment from "../models/comment.model";

// 帖子控制器
export class PostController {
  // 创建帖子
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { title, content, category } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      const post = await Post.create({
        title,
        content,
        category,
        userId,
        views: 0,
        likes: 0,
        status: 1,
      });

      res.status(201).json({
        message: "发帖成功",
        post,
      });
    } catch (error) {
      console.error("发帖错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 获取帖子列表
  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, category, sort = "newest" } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = { status: 1 };
      if (category) {
        where.category = category;
      }

      // 添加排序逻辑
      const order: [string, string][] =
        sort === "hot" ? [["views", "DESC"]] : [["createdAt", "DESC"]];

      const { count, rows: posts } = await Post.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
        ],
        limit: Number(limit),
        offset,
        order, // 使用动态排序
      });

      res.json({
        posts,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      console.error("获取帖子列表错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
  // 获取帖子详情
  static async getDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const post = await Post.findOne({
        where: { id, status: 1 },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
          {
            model: Comment,
            where: { status: 1, parentId: null }, // 获取一级评论
            required: false,
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "username", "avatar"],
              },
              {
                model: Comment,
                as: "replies", // 获取子评论
                where: { status: 1 },
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["id", "username", "avatar"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!post) {
        res.status(404).json({ message: "帖子不存在" });
        return;
      }

      // 更新浏览量
      await post.increment("views");

      res.json({ post });
    } catch (error) {
      console.error("获取帖子详情错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
}
// ...原有代码...

// 新增管理员专用接口
export class PostAdminController {
  // 获取所有帖子（管理员视图）
  static async getAllForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status, category } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = status;
      if (category) where.category = category;

      const { count, rows: posts } = await Post.findAndCountAll({
        where,
        include: [{ model: User, attributes: ["id", "username"] }],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        posts,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ message: "获取帖子列表失败" });
    }
  }

  // 批量管理帖子
  static async batchManage(req: Request, res: Response): Promise<void> {
    try {
      const { ids, action } = req.body;

      let updateData = {};
      switch (action) {
        case "pin":
          updateData = { isPinned: true };
          break;
        case "unpin":
          updateData = { isPinned: false };
          break;
        case "lock":
          updateData = { isLocked: true };
          break;
        case "unlock":
          updateData = { isLocked: false };
          break;
        case "delete":
          updateData = { status: 0 };
          break;
      }

      await Post.update(updateData, { where: { id: ids } });
      res.json({ message: "操作成功" });
    } catch (error) {
      res.status(500).json({ message: "操作失败" });
    }
  }
}
