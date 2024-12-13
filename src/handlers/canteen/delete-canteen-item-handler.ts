import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import Canteen_Item from '../../database/models/canteen-item-modal';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import { DeleteCanteenItemReqBody } from '../../../types/canteen';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as DeleteCanteenItemReqBody;

  const item = await Canteen_Item.getById(id);
  if (!item) {
    return next(new AppError('Canteen item not found', 'INVALID_PARAMETERS', 404));
  }

  await item.delete();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Canteen item deleted successfully',
    },
  };

  return res.status(200).json(response);
});

export const deleteCanteenItemBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as DeleteCanteenItemReqBody;

  if (!id) {
    return next(new AppError('Missing required field: id', 'MISSING_FIELDS', 400));
  }

  if (typeof id !== 'string') {
    return next(new AppError('Invalid id type, must be a number', 'INVALID_PARAMETERS', 400));
  }

  next();
};
