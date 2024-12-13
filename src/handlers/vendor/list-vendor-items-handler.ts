import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import VendorItem from '../../database/models/vendor-item-modal';
import { GenericAPIResponse } from '../../../types/global';
import { ObjectId } from 'mongodb';
import { ListVendorResBody } from '../../../types/vendor';
import User from '../../database/models/user-modal';

export const listVendorItemsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { vendorId } = req.params;

  const vendor = await User.getById(vendorId);
  if (!vendor || vendor.accountType !== 'vendor') {
    return next(new AppError('Invalid vendor ID', 'INVALID_PARAMETERS', 400));
  }

  const items = await VendorItem.getAllByVendor(new ObjectId(vendorId));

  const response: GenericAPIResponse<ListVendorResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'List of Vendor Items',
      items,
      vendor: vendor.toAbstractedUser(),
    },
  };

  return res.status(200).json(response);
});
