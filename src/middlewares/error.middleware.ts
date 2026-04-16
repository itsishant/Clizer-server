import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = Number(error?.statusCode ?? error?.status ?? 500);
  const message = error?.message ?? 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: error?.details ?? null,
      stack: env.isProduction ? undefined : error?.stack
    }
  });
};
