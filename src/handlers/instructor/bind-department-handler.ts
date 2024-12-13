import { NextFunction, Request, Response } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { BindInstructorDepartmentReqBody } from '../../../types/instructor';
import Instructor from '../../database/models/instructor-model';
import Department from '../../database/models/department-model';
import { ObjectId } from 'mongodb';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { instructorIds, departmentId } = req.body as BindInstructorDepartmentReqBody;

  const department = await Department.getById(departmentId);
  if (!department) {
    return next(new AppError('Department not found', 'INVALID_PARAMETERS', 404));
  }

  const instructors = department.instructors.map((instructor) => instructor.toString());
  instructorIds.forEach((instructorId) => {
    if (!instructors.includes(instructorId)) {
      instructors.push(instructorId);
    }
  });

  department.instructors = instructors.map((instructor) => new ObjectId(instructor));
  await department.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Instructors bound to department successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const BindDepartmentBodyValidator = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { instructorIds, departmentId } = req.body as BindInstructorDepartmentReqBody;

  const missing: string[] = [];

  if (!instructorIds) missing.push('instructorIds');
  if (!departmentId) missing.push('departmentId');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  const errors: string[] = [];

  if (!Array.isArray(instructorIds)) errors.push('instructorIds must be an array');
  if (!instructorIds.length) errors.push('instructorIds must not be empty');

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 'INVALID_PARAMETERS', 400));
  }

  await Promise.all(
    instructorIds.map(async (instructorId) => {
      const user = await Instructor.getById(instructorId);
      if (!user) errors.push('instructorId (' + instructorId + ') does not exist');
      if (user && user.accountType !== 'instructor')
        errors.push('instructorId (' + instructorId + ') is not an instructor');
    })
  );

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 'INVALID_PARAMETERS', 400));
  }

  next();
});
