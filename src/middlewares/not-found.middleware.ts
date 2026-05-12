import { NextFunction, Request, Responsport const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next({
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};
