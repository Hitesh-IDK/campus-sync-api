/*
 * Request Body
 */

import { AbstractedUser } from './auth';
import { GenericAPIBody } from './global';

export interface RefreshReqBody {
  phone: number;
}

/*
 * Response Body
 */

export interface RefreshResBody extends GenericAPIBody {
  access_token: string;
}

export interface ListUsersResBody extends GenericAPIBody {
  items: AbstractedUser[];
}
