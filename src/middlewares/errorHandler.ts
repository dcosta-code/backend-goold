import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  errorCode?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorCode = err.errorCode;

  if (env.isDevelopment) {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      statusCode,
      errorCode,
    });
  }

  if (env.isProduction) {
    const response: Record<string, unknown> = {
      status: "error",
      statusCode,
    };
    if (errorCode) {
      response.errorCode = errorCode;
    }
    res.status(statusCode).json(response);
    return;
  }

  const response: Record<string, unknown> = {
    status: "error",
    statusCode,
    message,
    stack: err.stack,
  };
  if (errorCode) {
    response.errorCode = errorCode;
  }
  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (env.isProduction) {
    res.status(404).json({
      status: "error",
      statusCode: 404,
    });
    return;
  }

  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
};
