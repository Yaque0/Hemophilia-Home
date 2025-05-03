import { Request, Response } from "express";
import { News } from "../models/news.model";
import { validationResult } from "express-validator";
import User from "../models/user.model";

export class NewsController {
  // 创建新闻
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user?.id) {
        return res.status(401).json({ error: "未授权" });
      }
      const userId: number = req.user.id;

      const { title, content, coverImage, link } = req.body;

      const news = await News.create({
        title,
        content,
        coverImage,
        link,
        userId,
        views: 0,
        likes: 0,
        status: 1,
      });

      return res.status(201).json({ news });
    } catch (error) {
      return res.status(500).json({ error: "创建新闻失败" });
    }
  }

  // 获取新闻列表（带热度排序）
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { sort = "newest", page = 1, limit = 10 } = req.query;

      const order: [string, string][] =
        sort === "hot" ? [["views", "DESC"]] : [["createdAt", "DESC"]];

      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: news } = await News.findAndCountAll({
        where: { status: 1 },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
        ],
        order,
        limit: Number(limit),
        offset,
      });

      return res.json({
        news,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      return res.status(500).json({ error: "获取新闻列表失败" });
    }
  }

  // 获取新闻详情
  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const news = await News.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
        ],
      });

      if (!news) {
        return res.status(404).json({ error: "新闻未找到" });
      }

      await news.increment("views", { by: 1 });
      return res.json({ news });
    } catch (error) {
      return res.status(500).json({ error: "获取新闻详情失败" });
    }
  }

  // 更新新闻
  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title, content, coverImage, link } = req.body;

      if (!req.user?.id) {
        return res.status(401).json({ error: "未授权" });
      }
      const userId: number = req.user.id;

      const news = await News.findOne({ where: { id, userId } });
      if (!news) {
        return res.status(404).json({ error: "新闻未找到或无权修改" });
      }

      await news.update({
        title: title || news.title,
        content: content || news.content,
        coverImage: coverImage || news.coverImage,
        link: link || news.link,
      });

      return res.json({ news });
    } catch (error) {
      return res.status(500).json({ error: "更新新闻失败" });
    }
  }
  // 删除新闻
  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!req.user?.id) {
        return res.status(401).json({ error: "未授权" });
      }
      const userId: number = req.user.id;

      const news = await News.findOne({ where: { id, userId } });
      if (!news) {
        return res.status(404).json({ error: "新闻未找到或无权删除" });
      }

      await news.update({ status: 0 });
      return res.json({ message: "新闻删除成功" });
    } catch (error) {
      return res.status(500).json({ error: "删除新闻失败" });
    }
  }

  // 点赞新闻
  static async like(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const news = await News.findByPk(id);

      if (!news) {
        return res.status(404).json({ error: "新闻未找到" });
      }

      await news.increment("likes", { by: 1 });
      return res.json({ likes: news.likes + 1 });
    } catch (error) {
      return res.status(500).json({ error: "点赞失败" });
    }
  }
}

// 新增管理员专用接口
export class NewsAdminController {
  // 获取所有新闻（管理员视图）
  static async getAllForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = status;

      const { count, rows: news } = await News.findAndCountAll({
        where,
        include: [{ model: User, attributes: ["id", "username"] }],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        news,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ message: "获取新闻列表失败" });
    }
  }

  // 批量更新新闻状态
  static async batchUpdateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ids, status } = req.body;
      await News.update({ status }, { where: { id: ids } });
      res.json({ message: "批量更新成功" });
    } catch (error) {
      res.status(500).json({ message: "批量更新失败" });
    }
  }
}
