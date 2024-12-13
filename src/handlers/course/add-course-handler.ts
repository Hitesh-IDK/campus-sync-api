import { ObjectId } from 'mongodb';
import { AddCourseReqBody } from '../../../types/course';
import Course from '../../database/models/course-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import Class from '../../database/models/class-model';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, code, handler, class: classId } = req.body as AddCourseReqBody;

  const classObj = await Class.getById(new ObjectId(classId));
  if (!classObj) return next(new AppError('Department not found', 'INVALID_PARAMETERS', 404));

  const newCourse = new Course(name, description, code, new ObjectId(handler));
  await newCourse.save();

  if (!newCourse.id) return next(new AppError('Course not created', 'INVALID_PARAMETERS', 500));

  classObj.courses.push(newCourse.id);
  await classObj.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 201,
    data: {
      message: 'Course added successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const AddCourseBodyValidator = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, code, handler } = req.body as AddCourseReqBody;

  const missing: string[] = [];

  if (!name) missing.push('name');
  if (!description) missing.push('description');
  if (!code) missing.push('code');
  if (!handler) missing.push('handler');

  if (missing.length > 0) {
    return next(new Error(`Missing required fields! - ${missing.join(', ')}`));
  }

  const errors: string[] = [];

  const validateName = Course.validateName(name);
  const validateDescription = Course.validateDescription(description);
  const validateCode = await Course.validateCode(code);
  const validateHandler = await Course.validateHandler(new ObjectId(handler));

  if (validateName) errors.push(validateName);
  if (validateDescription) errors.push(validateDescription);
  if (validateCode) errors.push(validateCode);
  if (validateHandler) errors.push(validateHandler);

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 'INVALID_PARAMETERS', 400));
  }

  next();
});
