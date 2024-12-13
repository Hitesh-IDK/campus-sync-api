import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import VendorItem from '../../database/models/vendor-item-modal';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import { DeleteVendorReqBody } from '../../../types/vendor';

export const deleteVendorItemHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as DeleteVendorReqBody;

  const item = await VendorItem.getById(id);
  if (!item) {
    return next(new AppError('Vendor item not found', 'INVALID_PARAMETERS', 404));
  }

  await item.delete();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Vendor item deleted successfully',
    },
  };

  return res.status(200).json(response);
});
