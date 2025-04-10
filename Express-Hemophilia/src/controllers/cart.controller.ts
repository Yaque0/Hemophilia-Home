import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

export class CartController {
  // 添加商品到购物车
  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { productId, quantity } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      // 检查商品是否存在
      const product = await Product.findOne({
        where: { id: productId, status: 1 },
      });

      if (!product) {
        res.status(404).json({ message: "商品不存在" });
        return;
      }

      // 检查库存
      if (product.stock < quantity) {
        res.status(400).json({ message: "商品库存不足" });
        return;
      }

      // 查找购物车中是否已存在该商品
      let cartItem = await Cart.findOne({
        where: { userId, productId },
      });

      if (cartItem) {
        // 更新数量
        await cartItem.update({
          quantity: cartItem.quantity + quantity,
        });
      } else {
        // 创建新的购物车项
        cartItem = await Cart.create({
          userId,
          productId,
          quantity,
        });
      }

      res.status(201).json({
        message: "添加成功",
        cartItem,
      });
    } catch (error) {
      console.error("添加购物车错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 获取购物车列表
  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price", "image", "stock"],
          },
        ],
      });

      res.json({ cartItems });
    } catch (error) {
      console.error("获取购物车列表错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 更新购物车商品数量
  static async updateQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      const cartItem = await Cart.findOne({
        where: { id, userId },
        include: [Product],
      });

      if (!cartItem) {
        res.status(404).json({ message: "购物车商品不存在" });
        return;
      }

      // 检查库存
      const product = await Product.findByPk(cartItem.productId);
      if (product && product.stock < quantity) {
        res.status(400).json({ message: "商品库存不足" });
        return;
      }

      await cartItem.update({ quantity });

      res.json({
        message: "更新成功",
        cartItem,
      });
    } catch (error) {
      console.error("更新购物车数量错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }

  // 从购物车删除商品
  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "请先登录" });
        return;
      }

      const cartItem = await Cart.findOne({
        where: { id, userId },
      });

      if (!cartItem) {
        res.status(404).json({ message: "购物车商品不存在" });
        return;
      }

      await cartItem.destroy();

      res.json({ message: "删除成功" });
    } catch (error) {
      console.error("删除购物车商品错误:", error);
      res.status(500).json({ message: "服务器错误" });
    }
  }
}
