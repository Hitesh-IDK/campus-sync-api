import { NextFunction, Request, Response } from 'express';
import { GenericAPIBody, GenericAPIResponse } from '../../types/global';
import { AppError } from '../middleware/error-middleware';

export const ActiveEndpointHandler = (req: Request, res: Response): Response => {
  const body: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,

    data: {
      message: 'Endpoint is active!',
    },
  };

  return res.json(body);
};

export const MethodNotAllowedHandler = (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`${req.originalUrl} does not support this method!`, 'INVALID_REQUEST', 405));
};

export const InvalidEndpointHandler = (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`${req.originalUrl} does not exist!`, 'INVALID_ENDPOINT', 404));
};
