import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { auth } from "../middlewares/auth.middleware";
import { body } from "express-validator";

const router = Router();

// 评论验证规则
const commentValidation = [
  body("postId").isInt().withMessage("帖子ID必须是数字"),
  body("content")
    .isString()
    .isLength({ min: 1 })
    .withMessage("评论内容不能为空"),
];

// 评论路由
router.post("/", auth, commentValidation, CommentController.create);
router.get("/post/:postId", CommentController.getList);
router.delete("/:id", auth, CommentController.delete);

export default router;
