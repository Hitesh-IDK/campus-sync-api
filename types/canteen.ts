export type CanteenItemTypes = 'breakfast' | 'lunch' | 'snacks';

/*
 * Request Body
 */

export interface AddCanteenReqBody {
  name: string;
  description: string;
  price: number | string;
  type: CanteenItemTypes;
}

export interface UpdateCanteenReqBody {
  id: string;
  name?: string;
  description?: string;
  price?: number | string;
  type?: CanteenItemTypes;
}

export interface DeleteCanteenItemReqBody {
  id: string;
}

/*
 * Response Body
 */

import { GenericAPIBody } from './global';

export interface CanteenItemAbstracted {
  id: string;
  name: string;
  description: string;
  price: number;
  type: CanteenItemTypes;
  photo: string;
}

export interface ListCanteenItemsResBody extends GenericAPIBody {
  items: CanteenItemAbstracted[];
}

/*
 * Database Body
 */

export interface CanteenItemDbBody {
  id: string;
  name: string;
  description: string;
  price: number;
  type: CanteenItemTypes;
  photo: string;
  created_at: Date;
  updated_at: Date;
}
