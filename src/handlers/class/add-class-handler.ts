import { ObjectId } from 'mongodb';
import { AddClassReqBody } from '../../../types/class';
import Class from '../../database/models/class-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import Department from '../../database/models/department-model';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { code, name, description, department: departmentId, instructor } = req.body as AddClassReqBody;

  const department = await Department.getById(departmentId);
  if (!department) return next(new AppError('Department not found', 'INVALID_PARAMETERS', 404));

  const newClass = new Class(code, name, description, new ObjectId(instructor), [], []);
  await newClass.save();

  if (!newClass.id) return next(new AppError('Class not created', 'INVALID_PARAMETERS', 500));

  department.classes.push(newClass.id);
  await department.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 201,
    data: {
      message: 'Class added successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const AddClassBodyValidator = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { code, name, description, department, instructor } = req.body as AddClassReqBody;

  const missing: string[] = [];

  if (!code) missing.push('code');
  if (!name) missing.push('name');
  if (!description) missing.push('description');
  if (!department) missing.push('department');
  if (!instructor) missing.push('instructor');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  const errors: string[] = [];

  const validateCode = await Class.validateCode(code);
  const validateName = Class.validateName(name);
  const validateDescription = Class.validateDescription(description);
  const validateinstructor = await Class.validateInstructor(new ObjectId(instructor));

  if (validateCode) errors.push(validateCode);
  if (validateName) errors.push(validateName);
  if (validateDescription) errors.push(validateDescription);
  if (validateinstructor) errors.push(validateinstructor);

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 'INVALID_PARAMETERS', 400));
  }

  next();
});
