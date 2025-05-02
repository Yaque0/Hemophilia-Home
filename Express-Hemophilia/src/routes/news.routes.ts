import { Router } from "express";
import { NewsController } from "../controllers/news.controller";
import { auth } from "../middlewares/auth.middleware";
import { body } from "express-validator";

const router = Router();

// 创建新闻验证规则
const createValidation = [
  body("title").notEmpty().withMessage("标题不能为空"),
  body("content").notEmpty().withMessage("内容不能为空"),
];

// 新闻路由
router.post("/", auth, createValidation, NewsController.create);
router.get("/", NewsController.getAll);
router.get("/:id", NewsController.getById);
router.put("/:id", auth, NewsController.update);
router.delete("/:id", auth, NewsController.delete);
router.post("/:id/like", NewsController.like);

export default router;
