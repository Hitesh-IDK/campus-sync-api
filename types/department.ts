/*
 * Resquest Body
 */

import { ObjectId } from 'mongodb';
import { AbstractedUser } from './auth';
import { GenericAPIBody } from './global';

export interface AddDepartmentReqBody {
  name: string;
  description: string;
  handler: string;

  institutionId: string;
}

export interface UpdateDepartmentReqBody {
  id: string;
  name?: string;
  description?: string;
  handler?: string;
}

export interface DeleteDepartmentReqBody {
  id: string;
}

/*
 * Response Body
 */

export interface ListDepartmentResBody extends GenericAPIBody {
  departments: AbstractedDepartment[];
}

export interface ShowDepartmentResBody extends GenericAPIBody {
  department: AbstractedDepartment;
}

/*
 * Database Body
 */

export interface DepartmentDbBody {
  id: string;
  name: string;
  description: string;
  handler: ObjectId;
  instructors: ObjectId[];
}

export interface AbstractedDepartment {
  id: string;
  name: string;
  description: string;
  handler: AbstractedUser;
  instructors: AbstractedUser[];
}
