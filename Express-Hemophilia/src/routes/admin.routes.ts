import express from "express";
import { adminRequired } from "../middlewares/admin.middleware";
import { AdminController } from "../controllers/admin.controller";
import { NewsAdminController } from "../controllers/news.controller";
import { PostAdminController } from "../controllers/post.controller";

const router = express.Router();

// 用户管理
router.get("/users", adminRequired, AdminController.getUsers);
router.put("/users/:id", adminRequired, AdminController.updateUser);

// 新闻管理
router.get("/news", adminRequired, NewsAdminController.getAllForAdmin);
router.put(
  "/news/batch-status",
  adminRequired,
  NewsAdminController.batchUpdateStatus
);

// 论坛管理
router.get("/posts", adminRequired, PostAdminController.getAllForAdmin);
router.put("/posts/batch", adminRequired, PostAdminController.batchManage);

export default router;
