import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Comment from "../models/comment.model";
import Post from "../models/post.model";
import User from "../models/user.model";

export class CommentController {
  // 创建评论
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { postId, content, parentId } = req.body; // 接收 parentId
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      // 检查帖子是否存在
      const post = await Post.findOne({ where: { id: postId, status: 1 } });
      if (!post) {
        res.status(404).json({ message: "帖子不存在" });
        return;
      }

      // 创建评论
      const comment = await Comment.create({
        postId,
        userId,
        content,
        parentId: parentId || null, // 如果是子评论，传入 parentId
        status: 1,
      });

      res.status(201).json({
        message: "评论成功",
        comment,
      });
    } catch (error) {
      console.error("评论错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: comments } = await Comment.findAndCountAll({
        where: { postId, status: 1, parentId: null },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
          {
            model: Comment,
            as: "replies",
            required: false,
            where: { status: 1 },
            limit: 3, // 首次只加载3条二级评论
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "username", "avatar"],
              },
            ],
          },
        ],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        comments,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      console.error("获取评论列表错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 删除评论
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      const comment = await Comment.findOne({ where: { id, status: 1 } });

      if (!comment) {
        res.status(404).json({ message: "评论不存在" });
        return;
      }

      // 检查是否是评论作者
      if (comment.userId !== userId) {
        res.status(403).json({ message: "没有权限删除此评论" });
        return;
      }

      await comment.update({ status: 0 });

      res.json({ message: "删除成功" });
    } catch (error) {
      console.error("删除评论错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
  // 获取更深层次的评论
  static async getDeepComments(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: comments } = await Comment.findAndCountAll({
        where: {
          parentId: Number(parentId),
          status: 1,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
        ],
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        comments,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        hasMore: count > offset + comments.length,
      });
    } catch (error) {
      console.error("获取深层评论错误:", error);
      res.status(500).json({
        message: "服务器错误",
        error: error.message,
      });
    }
  }
}
