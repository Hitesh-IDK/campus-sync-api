import { NextFunction, Request, Response } from "express";
import { Errors } from "../../types/global";

const SendDevError = (err: AppError, res: Response) => {
  const statusCode = err.statusCode || 500;
  const { message, name } = err;

  return res.status(statusCode).json({
    success: false,
    code: statusCode,
    data: {
      message,
      error: name,
      err,
    },
  });
};

const SendProdError = (err: AppError, res: Response) => {
  const statusCode = err.statusCode || 500;
  const { message, name } = err;

  return res.status(statusCode).json({
    success: false,
    code: statusCode,
    data: {
      message: err.isOperational ? message : "Something went wrong",
      error: err.isOperational ? name : "SERVER_ERROR",
    },
  });
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "TokenExpiredError") {
    err = new AppError("Token expired", "AUTHENTICATION_ERROR", 401);
  }

  if (process.env.ENVIRONMENT === "production") {
    return SendProdError(err, res);
  } else {
    return SendDevError(err, res);
  }
};

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, name: Errors, statusCode: number) {
    super(message);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
