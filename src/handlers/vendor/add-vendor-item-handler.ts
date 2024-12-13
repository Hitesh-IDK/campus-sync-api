import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import VendorItem from '../../database/models/vendor-item-modal';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import { AddVendorReqBody } from '../../../types/vendor';
import { ObjectId } from 'mongodb';
import User from '../../database/models/user-modal';

export const addVendorItemHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, vendorId } = req.body as AddVendorReqBody;

  const baseURL = process.env.image_base_URL;
  const photo = req.file ? `${baseURL}/vendor/${req.file.filename}` : `${baseURL}/placeholder.png`;

  // Check if vendorId is a valid vendor user
  const vendor = await User.getById(vendorId);
  if (!vendor || vendor.accountType !== 'vendor') {
    return next(new AppError('Invalid vendor ID', 'INVALID_PARAMETERS', 400));
  }

  const newItem = new VendorItem(name, description, Number(price), photo, new ObjectId(vendorId));
  await newItem.save();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 201,
    data: {
      message: 'Vendor item added successfully',
    },
  };

  return res.status(201).json(response);
});

export const AddVendorItemBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, vendorId } = req.body as AddVendorReqBody;

  const missing: string[] = [];

  if (!name) missing.push('name');
  if (!description) missing.push('description');
  if (!price) missing.push('price');
  if (!vendorId) missing.push('vendorId');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  if (!Number(price) || Number(price) <= 0) {
    return next(new AppError('Price must be a positive number', 'INVALID_PARAMETERS', 400));
  }

  next();
};
