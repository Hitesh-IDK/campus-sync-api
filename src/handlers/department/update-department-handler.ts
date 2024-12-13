import { ObjectId } from 'mongodb';
import { UpdateDepartmentReqBody } from '../../../types/department';
import Department from '../../database/models/department-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import User from '../../database/models/user-modal';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, description, handler } = req.body as UpdateDepartmentReqBody;

  const department = await Department.getById(id);
  if (!department) {
    return next(new AppError('Department not found', 'INVALID_PARAMETERS', 404));
  }

  if (name) department.name = name;
  if (description) department.description = description;
  if (handler) {
    const user = await User.getById(handler);
    const prevUser = await User.getById(department.handler.toString());

    user.accountType = 'department_spoc';
    prevUser.accountType = 'instructor';

    department.handler = new ObjectId(handler);

    await user.update();
    await prevUser.update();
  }

  await department.update();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Department updated successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const UpdateDepartmentBodyValidator = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, description, handler } = req.body as UpdateDepartmentReqBody;

  const missing: string[] = [];

  if (!id) missing.push('id');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  const changing: string[] = [];
  const errors: string[] = [];

  if (name) {
    changing.push('name');
    const validateName = Department.validateName(name);
    if (validateName) errors.push(validateName);
  }

  if (description) {
    changing.push('description');
    const validateDescription = Department.validateDescription(description);
    if (validateDescription) errors.push(validateDescription);
  }

  if (handler) {
    changing.push('handler');
    const validateHandler = await Department.validateHandler(new ObjectId(handler));
    if (validateHandler) errors.push(validateHandler);
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join(', '), 'INVALID_PARAMETERS', 400));
  }

  if (changing.length === 0) {
    return next(new AppError('No fields to update', 'INVALID_PARAMETERS', 400));
  }

  next();
});
