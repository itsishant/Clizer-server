import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app-error';

export const authorize = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  if (!roles.includes(req.user.role)) {
    next(new AppError('Forbidden', 403));
    return;
  }

  next();
};
