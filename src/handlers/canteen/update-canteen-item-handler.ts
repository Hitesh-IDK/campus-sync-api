import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../middleware/error-middleware';
import Canteen_Item from '../../database/models/canteen-item-modal';
import { UpdateCanteenReqBody } from '../../../types/canteen';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as UpdateCanteenReqBody;
  const { name, description, price, type } = req.body as UpdateCanteenReqBody;

  const item = await Canteen_Item.getById(id);
  if (!item) {
    return next(new Error('Canteen item not found'));
  }

  if (name) item.name = name;
  if (description) item.description = description;
  if (price) item.price = Number(price);
  if (type) item.type = type;

  await item.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Canteen item updated successfully',
    },
  };

  return res.status(200).json(response);
});

export const updateCanteenItemBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id, name, description, price, type } = req.body as UpdateCanteenReqBody;

  if (!id) {
    return next(new Error('Missing required field: id'));
  }

  if (!name && !description && !price && !type) {
    return next(new Error('At least one parameter (name, description, price, type) must be provided to update'));
  }

  const errors: string[] = [];

  if (type && type !== 'breakfast' && type !== 'lunch' && type !== 'snacks') {
    errors.push('type must be breakfast, lunch or snacks');
  }

  if (price && Number(price) < 0) {
    errors.push('price must be greater than 0');
  }

  if (errors.length > 0) {
    return next(new Error(errors.join(', ')));
  }

  next();
};
