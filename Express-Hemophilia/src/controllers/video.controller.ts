import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import Video from "../models/video.model";
import { adminRequired } from "../middlewares/admin.middleware";
import User from "../models/user.model";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, "../../public/uploads/videos");
const TEMP_DIR = path.join(UPLOAD_DIR, "temp");

// 初始化上传目录
const initUploadDirs = async () => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(TEMP_DIR, { recursive: true });
};

// 初始化上传
export const initUpload = async (req: Request, res: Response) => {
  await initUploadDirs();
  const { fileSize, chunkSize } = req.body;

  const uploadId = uuidv4();
  const chunkCount = Math.ceil(fileSize / chunkSize);

  res.json({ uploadId, chunkCount });
};

// 上传分片
export const uploadChunk = async (req: Request, res: Response) => {
  const { uploadId, chunkIndex } = req.body;
  const chunk = req.file;

  if (!chunk) return res.status(400).json({ message: "分片数据无效" });

  try {
    const chunkDir = path.join(TEMP_DIR, uploadId);
    await fs.mkdir(chunkDir, { recursive: true });

    await fs.writeFile(
      path.join(chunkDir, chunkIndex.toString()),
      chunk.buffer
    );

    const chunks = await fs.readdir(chunkDir);
    return res.json({
      progress: ((chunks.length / req.body.totalChunks) * 100).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "分片上传失败" });
    return;
  }
};
// 验证文件类型
const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".avi"];
function isValidFileType(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}
// 合并分片
export const mergeChunks = async (req: Request, res: Response) => {
  const { uploadId, fileName, userId } = req.body;
  if (!isValidFileType(fileName)) {
    res.status(400).json({ message: "不支持的文件类型" });
  }
  try {
    const chunkDir = path.join(TEMP_DIR, uploadId);
    const chunks = await fs.readdir(chunkDir);
    chunks.sort((a, b) => parseInt(a) - parseInt(b));

    const finalPath = path.join(UPLOAD_DIR, `${uploadId}_${fileName}`);
    const writeStream = createWriteStream(finalPath); // 使用原生fs的createWriteStream

    for (const chunk of chunks) {
      const chunkPath = path.join(chunkDir, chunk);
      const data = await fs.readFile(chunkPath);
      writeStream.write(data);
      await fs.unlink(chunkPath);
    }

    writeStream.end();
    await fs.rmdir(chunkDir);

    // 创建视频记录
    const video = await Video.create({
      title: req.body.title,
      cover: req.body.cover,
      url: `/uploads/videos/${uploadId}_${fileName}`,
      userId,
      status: 1,
    });

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "文件合并失败" });
  }
};

// 视频管理CRUD操作
export const getVideos = async (_: Request, res: Response) => {
  try {
    const videos = await Video.findAll({
      order: [["created_at", "DESC"]],
      include: [User],
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "获取视频列表失败" });
  }
};

export const deleteVideo = [
  adminRequired,
  async (req: Request, res: Response) => {
    try {
      const video = await Video.findByPk(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "视频未找到" });
      }

      // 删除文件
      const filePath = path.join(UPLOAD_DIR, path.basename(video.url));
      await fs.unlink(filePath);

      await video.destroy();
      return res.json({ message: "视频删除成功" });
    } catch (error) {
      return res.status(500).json({ message: "删除视频失败" });
    }
  },
];
