import { ObjectId } from 'mongodb';
import { AbstractedUser } from './auth';
import { AbstractedCourse } from './course';
import { GenericAPIBody } from './global';

/*
 * Request Body
 */

export interface AddClassReqBody {
  code: string;
  name: string;
  description: string;
  department: string;
  instructor: string;
}

/*
 * Response Body
 */

export interface ListClassResBody extends GenericAPIBody {
  classes: AbstractedClass[];
}

/*
 * Database Body
 */

export interface ClassDbBody {
  id: string;
  code: string;
  name: string;
  description: string;
  insturctor: ObjectId;
  courses: ObjectId[];
  students: ObjectId[];
}

export interface AbstractedClass {
  id: string;
  code: string;
  name: string;
  description: string;
  insturctor: AbstractedUser;
  courses: AbstractedCourse[];
  students: AbstractedUser[];
}
