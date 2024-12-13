import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../middleware/error-middleware';
import Canteen_Item from '../../database/models/canteen-item-modal';
import { ListCanteenItemsResBody } from '../../../types/canteen';
import { GenericAPIResponse } from '../../../types/global';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const items = await Canteen_Item.getAll();
  const abstractedItems = items.map(Canteen_Item.toAbstract);

  const response: GenericAPIResponse<ListCanteenItemsResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'List of Canteen Items',
      items: abstractedItems,
    },
  };

  return res.status(200).json(response);
});
