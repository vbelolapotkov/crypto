import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
