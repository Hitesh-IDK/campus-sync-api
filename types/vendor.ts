/*
 * Request Body
 */

import { AbstractedUser } from './auth';
import { GenericAPIBody } from './global';

export interface AddVendorReqBody {
  name: string;
  phone: string;
  description: string;
  price: number | string;

  vendorId?: string;
}

export interface UpdateVendorReqBody {
  id: string;
  name?: string;
  phone?: string;
  price?: number | string;
  description?: string;
}

export interface DeleteVendorReqBody {
  id: string;
}

/*
 * Response Body
 */

export interface ListVendorResBody extends GenericAPIBody {
  items: VendorDbBody[];
  vendor: AbstractedUser;
}

/*
 * Database body
 */

export interface VendorDbBody {
  id: string;
  name: string;
  photo: string;
  description: string;
  price: number;
}
