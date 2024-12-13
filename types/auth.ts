/*
 * Database Body
 */

import { AccountTypes, GenericAPIBody } from './global';

export interface UserDbBody {
  id: string;
  registrationId: string;
  name: string;
  phone: number;
  qualification: string;
  email: string;
  password: string;
  photo: string;
  accountType: AccountTypes;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

/*
 * Request Body
 */

export interface LoginReqBody {
  phone: number;
  password: string;
}

export interface RegisterReqBody {
  registration_id: string;
  departmentId?: string;
  image?: string;

  name: string;
  qualification?: string;
  phone: string;
  email?: string;
  account_type?: AccountTypes;

  password: string;
}

/*
 * Response Body
 */

export interface AbstractedUser {
  id: string;
  registration_id: string;
  name: string;
  qualification?: string;
  phone: number;
  email: string;
  photo: string;
  account_type: AccountTypes;
}

export interface LoginResBody extends GenericAPIBody {
  user: AbstractedUser;
  access_token: string;
  refresh_token: string;
}
