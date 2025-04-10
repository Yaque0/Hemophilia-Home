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

dotenv.config();

const app = express();

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

// 数据库连接和服务器启动
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("数据库连接成功");

    await sequelize.sync({ alter: true });
    console.log("数据库同步完成");

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("启动服务器失败:", error);
  }
}

startServer();
