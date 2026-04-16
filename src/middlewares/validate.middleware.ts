import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sanitizeInput } from '../utils/sanitize';

export const validate = (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const parsed = schema.parse({
      body: sanitizeInput(req.body),
      params: sanitizeInput(req.params),
      query: sanitizeInput(req.query)
    });

    req.body = parsed.body;
    req.params = parsed.params;
    req.query = parsed.query;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      next({
        statusCode: 422,
        message: 'Validation failed',
        details: error.flatten()
      });
      return;
    }
    next(error);
  }
};
