import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Carousel from "../models/carousel.model";

export class CarouselController {
  // 创建轮播图
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { image, link, sorOrder, title } = req.body; // 修正 sorOrder 为 sorOrder

      // 创建轮播图记录
      const carousel = await Carousel.create({
        image,
        link,
        sorOrder, // 使用正确的字段名
        title,
        status: 1,
      });

      res.status(201).json({
        message: "轮播图创建成功",
        carousel,
      });
    } catch (error) {
      console.error("轮播图创建失败", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 获取轮播图列表
  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 5 } = req.query; // 使用 req.query 获取分页数据
      const offset = (Number(page) - 1) * Number(limit);

      // 获取轮播图
      const { count, rows: carousel } = await Carousel.findAndCountAll({
        where: {
          status: 1,
        },
        limit: Number(limit),
        offset,
        order: [
          ["sorOrder", "ASC"], // 使用正确的字段名
          ["createdAt", "DESC"],
        ], // 顺序排列
      });

      res.status(200).json({
        message: "轮播图获取成功",
        carousel,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      console.error("轮播图获取失败", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 获取轮播图详情
  static async getDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const carousel = await Carousel.findByPk(id);
      if (!carousel) {
        res.status(404).json({ error: "轮播图不存在" });
        return;
      }
      res.status(200).json({
        message: "轮播图获取成功",
        carousel,
      });
    } catch (error) {
      console.error("轮播图获取失败", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 更新轮播图
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { image, link, sorOrder, title } = req.body; // 修正 sorOrder 为 sorOrder
      const carousel = await Carousel.findByPk(id);
      if (!carousel) {
        res.status(404).json({ error: "轮播图不存在" });
        return;
      }

      // 使用 update 方法更新数据
      await carousel.update({
        image,
        link,
        sorOrder, // 使用正确的字段名
        title,
      });

      res.status(200).json({
        message: "轮播图更新成功",
        carousel,
      });
    } catch (error) {
      console.error("轮播图更新失败", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }

  // 删除轮播图
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const carousel = await Carousel.findByPk(id);
      if (!carousel) {
        res.status(404).json({ error: "轮播图不存在" });
        return;
      }

      // 使用 destroy 方法删除
      await carousel.destroy();

      res.status(200).json({
        message: "轮播图删除成功",
      });
    } catch (error) {
      console.error("轮播图删除失败", error);
      res.status(500).json({ error: "服务器错误" });
    }
  }
}
