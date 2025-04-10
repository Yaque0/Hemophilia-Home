import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { auth } from "../middlewares/auth.middleware";
import { body } from "express-validator";

const router = Router();

// 购物车验证规则
const cartValidation = [
  body("productId").isInt().withMessage("商品ID必须是数字"),
  body("quantity").isInt({ min: 1 }).withMessage("数量必须是大于0的整数"),
];

// 购物车路由
router.post("/", [auth, ...cartValidation] as any[], CartController.addToCart);
router.get("/", auth, CartController.getList);
router.put(
  "/:id/quantity",
  [auth, ...cartValidation] as any[],
  CartController.updateQuantity
);
router.delete("/:id", auth, CartController.removeFromCart);

export default router;
