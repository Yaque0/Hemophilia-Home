import express from "express";
import { CarouselController } from "../controllers/carousel.contronler";

const router = express.Router();

// 创建轮播图
router.post("/carousels", CarouselController.create);

// 获取轮播图列表
router.get("/carousels", CarouselController.getList);

// // 获取单个轮播图
// router.get("/carousels/:id", CarouselController.getDetail);

// 更新轮播图
router.put("/carousels/:id", CarouselController.update);

// 删除轮播图
router.delete("/carousels/:id", CarouselController.delete);

export default router;
