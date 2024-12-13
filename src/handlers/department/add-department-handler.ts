import { ObjectId } from 'mongodb';
import { AddDepartmentReqBody } from '../../../types/department';
import Department from '../../database/models/department-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import User from '../../database/models/user-modal';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, handler } = req.body as AddDepartmentReqBody;

  const user = await User.getById(handler);
  user.accountType = 'department_spoc';

  const newDepartment = new Department(name, description, new ObjectId(handler), [], []);
  await newDepartment.save();
  await user.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 201,
    data: {
      message: 'Department added successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const AddDepartmentBodyHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, handler, institutionId } = req.body as AddDepartmentReqBody;

  const missing: string[] = [];

  if (!name) missing.push('name');
  if (!description) missing.push('description');
  if (!handler) missing.push('handler');
  if (!institutionId) missing.push('institutionId');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'INVALID_PARAMETERS', 400));
  }

  const errors: string[] = [];

  const validateName = Department.validateName(name);
  const validateDescription = Department.validateDescription(description);
  const validateHandler = await Department.validateHandler(new ObjectId(handler));

  if (validateName) errors.push(validateName);
  if (validateDescription) errors.push(validateDescription);
  if (validateHandler) errors.push(validateHandler);

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 'INVALID_PARAMETERS', 400));
  }

  next();
});
