import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import VendorItem from '../../database/models/vendor-item-modal';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import { UpdateVendorReqBody } from '../../../types/vendor';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export const updateVendorItemHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, description, price } = req.body as UpdateVendorReqBody;

  const item = await VendorItem.getById(id);
  if (!item) {
    return next(new AppError('Vendor item not found', 'INVALID_PARAMETERS', 404));
  }

  if (name) item.name = name;
  if (description) item.description = description;
  if (price) item.price = Number(price);
  if (req.file) {
    const baseURL = process.env.image_base_URL;
    const photo = req.file ? `${baseURL}/vendor/${req.file.filename}` : `${baseURL}/placeholder.png`;

    if (item.photo !== `${baseURL}/placeholder.png`) {
      await unlinkAsync(item.photo);
    }

    item.photo = photo;
  }

  await item.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Vendor item updated successfully',
    },
  };

  return res.status(200).json(response);
});

export const UpdateVendorItemBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id, name, description, price } = req.body as UpdateVendorReqBody;

  if (!id) {
    return next(new AppError('Missing required field: id', 'MISSING_FIELDS', 400));
  }

  if (!name && !description && !price && !req.file) {
    return next(
      new AppError(
        'At least one field (name, description, price, or photo) must be provided to update',
        'MISSING_FIELDS',
        400
      )
    );
  }

  if (price && (Number(price) || Number(price) <= 0)) {
    return next(new AppError('Price must be a positive number', 'INVALID_PARAMETERS', 400));
  }

  next();
};
