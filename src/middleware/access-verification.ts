import { NextFunction, Request, Response } from "express";

export const AccessVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      code: 403,
      data: { message: "Invalid access key!", error: "INVALID_ACCESS_KEY" },
    });
  }

  next();
};
