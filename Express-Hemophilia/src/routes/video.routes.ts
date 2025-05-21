import express from "express";
import multer from "multer";
import {
  initUpload,
  uploadChunk,
  mergeChunks,
  getVideos,
  deleteVideo,
} from "../controllers/video.controller";

const router = express.Router();
const chunkUpload = multer({ storage: multer.memoryStorage() });

// 公共接口
router.get("/", getVideos);

// 分片上传接口
router.post("/upload/init", initUpload);
router.post("/upload/chunk", chunkUpload.single("chunk"), uploadChunk);
router.post("/upload/merge", mergeChunks);

// 管理员接口
router.delete("/:id", deleteVideo);

export default router;
