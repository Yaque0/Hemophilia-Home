import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Product from "../models/product.model";

export class ProductController {
  // 创建药品
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        drugName,
        ingredients,
        indications,
        dosage,
        adverseReactions,
        contraindications,
        precautions,
        storage,
        specification,
        manufacturer,
        price,
        category,
        image,
        stock,
      } = req.body;

      const product = await Product.create({
        category,
        drugName,
        ingredients,
        indications,
        dosage,
        adverseReactions,
        contraindications,
        precautions,
        storage,
        specification,
        manufacturer,
        price,
        image,
        stock,
        status: 1,
      });

      res.status(201).json({
        message: "药品创建成功",
        product,
      });
    } catch (error) {
      console.error("创建药品错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 获取药品列表
  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = { status: 1 };

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        products,
        total: count,
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      });
    } catch (error) {
      console.error("获取药品列表错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 获取药品详情
  static async getDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = Number(id);

      if (isNaN(productId)) {
        res.status(400).json({ message: "药品ID无效" });
        return;
      }

      const product = await Product.findOne({
        where: { id: productId, status: 1 },
      });

      if (!product) {
        res.status(404).json({ message: "药品不存在" });
        return;
      }

      res.json({ product });
    } catch (error) {
      console.error("获取药品详情错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 更新药品
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await Product.findOne({
        where: { id, status: 1 },
      });

      if (!product) {
        res.status(404).json({ message: "药品不存在" });
        return;
      }

      await product.update(updates);

      res.json({
        message: "更新成功",
        product,
      });
    } catch (error) {
      console.error("更新药品错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 删除药品
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { id, status: 1 },
      });

      if (!product) {
        res.status(404).json({ message: "药品不存在" });
        return;
      }

      await product.update({ status: 0 });

      res.json({ message: "删除成功" });
    } catch (error) {
      console.error("删除药品错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
}
