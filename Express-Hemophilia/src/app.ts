import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import sequelize from "./config/database";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import carouselRouter from "./routes/carousel.routes";
import uploadRouter from "./routes/upload.routes";
import userRouter from "./routes/user.routes";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// 静态文件目录
app.use("/uploads", express.static(path.resolve(__dirname, "public/uploads")));

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", carouselRouter);
app.use("/api/users", userRouter);
app.use("/api/upload", uploadRouter);

// 数据库连接和服务器启动
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("数据库连接成功");

    await sequelize.sync({
      alter: false,
      logging: console.log,
      force: false,
    });
    console.log("数据库同步完成");

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("启动服务器失败:", error);
  }
}

startServer();
