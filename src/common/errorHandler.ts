
import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../config/env';
import AppError from './AppError';

const errorHandler = (
  err: AppError | Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    statusCode,
    message: err.message || 'Internal Server Error',
    error: err.name || 'Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

export default errorHandler;
