import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface JwtPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token);

    if (!token) {
      res.status(401).json({ message: "请先登录" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findByPk(decoded.id);

    if (!user || user.status !== 1) {
      res.status(401).json({ message: "请先登录" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "请先登录" });
  }
};

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "没有权限访问" });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "请先登录" });
  }
};
