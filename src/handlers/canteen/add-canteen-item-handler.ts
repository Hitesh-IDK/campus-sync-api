import { AddCanteenReqBody } from '../../../types/canteen';
import { catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import Canteen_Item from '../../database/models/canteen-item-modal';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';

export const addCanteenItemHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, type } = req.body as AddCanteenReqBody;

  const baseURL = process.env.image_base_URL;
  const photo = req.file ? `${baseURL}/canteen/${req.file.filename}` : `${baseURL}/placeholder.png`;

  const newItem = new Canteen_Item(name, description, Number(price), type, photo);
  await newItem.save();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 201,
    data: {
      message: 'Canteen item added successfully',
    },
  };

  return res.status(201).json(response);
});

export const AddCanteenItemBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, type } = req.body as AddCanteenReqBody;

  const missing: string[] = [];

  if (!name) missing.push('name');
  if (!description) missing.push('description');
  if (!price) missing.push('price');
  if (!type) missing.push('type');

  if (missing.length > 0) {
    return next(new Error(`Missing required fields! - ${missing.join(', ')}`));
  }

  const errors: string[] = [];

  if (type !== 'breakfast' && type !== 'lunch' && type !== 'snacks') {
    errors.push('type must be breakfast, lunch or snacks');
  }

  if (Number(price) < 0) {
    errors.push('price must be greater than 0');
  }

  if (errors.length > 0) {
    return next(new Error(errors.join(', ')));
  }

  next();
};
