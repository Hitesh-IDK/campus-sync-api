/*
 * Request Body
 */

import { ObjectId } from 'mongodb';
import { AbstractedUser } from './auth';

export interface AddCourseReqBody {
  class: string;
  handler: string;

  name: string;
  description: string;
  code: string;
}

/*
 * Response Body
 */

/*
 * Database Body
 */

export interface CourseNotes {
  file: string;
  title: string;
  summary: string;
}

export interface CourseDbBody {
  id: string;
  name: string;
  description: string;
  code: string;
  handler: ObjectId;

  notes: ObjectId[];
  notifications: string[];
  assignments: ObjectId[];
  assessments: ObjectId[];
}

export interface AbstractedCourse {
  id: string;
  name: string;
  description: string;
  code: string;
  handler: AbstractedUser;
}
