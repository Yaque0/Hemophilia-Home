import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";
import { body } from "express-validator";

const router = Router();

// 注册验证规则
const registerValidation = [
  body("email").isEmail().withMessage("请输入有效的邮箱地址"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("密码长度至少为6个字符"),
  body("username")
    .isString()
    .isLength({ min: 2 })
    .withMessage("用户名长度至少为2个字符"),
  body("phone")
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage("请输入有效的手机号码"),
];

// 登录验证规则
const loginValidation = [
  body("email").isEmail().withMessage("请输入有效的邮箱地址"),
  body("password").notEmpty().withMessage("请输入密码"),
];

router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);
router.get("/me", auth, AuthController.getCurrentUser);

export default router;
