import express from "express";
import { UserController } from "../controllers/user.contaoller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

// 所有用户路由均需登录验证
router.use(auth);

// 获取当前用户信息
router.get("/profile", UserController.getProfile);

// 更新用户信息（昵称、头像、电话等）
router.put("/profile", UserController.updateProfile);

// 修改密码
router.put("/password", UserController.updatePassword);

// 注销账号（逻辑删除）
router.delete("/delete", UserController.deleteAccount);

export default router;
