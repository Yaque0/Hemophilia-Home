import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { auth, adminAuth } from "../middlewares/auth.middleware";
import { body } from "express-validator";

const router = Router();

// 商品验证规则
const productValidation = [
  body("drugName")
    .isString()
    .isLength({ min: 2 })
    .withMessage("商品名称至少2个字符"),
  body("indications")
    .isString()
    .isLength({ min: 10 })
    .withMessage("商品描述至少10个字符"),
  body("price").isFloat({ min: 0 }).withMessage("价格必须是大于等于0的数字"),
  body("stock").isInt({ min: 0 }).withMessage("库存必须是大于等于0的整数"),
  body("category").isString().notEmpty().withMessage("请选择商品分类"),
];

// 商品路由
router.post(
  "/",
  [auth, adminAuth, ...productValidation] as any[],
  ProductController.create
);
router.get("/", ProductController.getList);
router.get("/:id", ProductController.getDetail);
router.put("/:id", [auth, adminAuth], ProductController.update);
router.delete("/:id", [auth, adminAuth], ProductController.delete);

export default router;
