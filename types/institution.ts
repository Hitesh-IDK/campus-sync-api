/*
 * Request Body
 */

import { ObjectId } from 'mongodb';
import { AbstractedUser } from './auth';
import { AbstractedDepartment } from './department';
import { GenericAPIBody } from './global';

export interface AddInstitutionReqBody {
  name: string;
  address: string;
  city: string;
  state: string;
  image?: string;

  handler: {
    qualification: string;
    name: string;
    phone: number;
    email?: string;
  };
}

/*
 * Response Body
 */

export interface ListInstitutionResBody extends GenericAPIBody {
  institutions: SemiAbstractedInstitution[];
}

/*
 * Database Body
 */

export interface InstitutionDbBody {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  image?: string;
  handler: ObjectId;
  departments: ObjectId[];
}

export interface SemiAbstractedInstitution {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  image?: string;
  handler: AbstractedUser;
  departments: ObjectId[];
}

export interface AbstractedInstitution {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  image?: string;
  handler: AbstractedUser;
  departments: AbstractedDepartment[];
}
