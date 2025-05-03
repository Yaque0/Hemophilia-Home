import { Request, Response, NextFunction } from "express";

export const adminRequired = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user as { role: string } | undefined;
  if (!user || user.role !== "admin") {
    res.status(403).json({
      code: 403,
      message: "需要管理员权限",
    });
    return;
  }
  next();
};
