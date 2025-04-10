import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { auth } from "../middlewares/auth.middleware";
import { body } from "express-validator";

const router = Router();

// 发帖验证规则
const postValidation = [
  body("title")
    .isString()
    .isLength({ min: 2 })
    .withMessage("标题长度至少为2个字符"),
  body("content")
    .isString()
    .isLength({ min: 10 })
    .withMessage("内容长度至少为10个字符"),
  body("category").isString().notEmpty().withMessage("请选择分类"),
];

// 帖子路由
router.post("/", auth, postValidation, PostController.create);
router.get("/", PostController.getList);
router.get("/:id", PostController.getDetail);

export default router;
