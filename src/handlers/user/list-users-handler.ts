import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import User from '../../database/models/user-modal';
import { AccountTypes, GenericAPIResponse } from '../../../types/global';
import { ListUsersResBody } from '../../../types/user';

export const listUsersHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { account_type } = req.params;

  const users = await User.getByAccountType(account_type as AccountTypes);

  const response: GenericAPIResponse<ListUsersResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'List of users by account type',
      items: users,
    },
  };

  return res.status(200).json(response);
});

export const ListUsersBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { account_type } = req.params;

  // Check if account_type is provided
  if (!account_type) {
    return next(new AppError('Missing required field: account_type', 'MISSING_FIELDS', 400));
  }

  // Validate account_type against the predefined AccountTypes
  const validAccountTypes: AccountTypes[] = [
    'student',
    'instructor',
    'vendor',
    'department_spoc',
    'institution_spoc',
    'admin',
  ];

  if (!validAccountTypes.includes(account_type as AccountTypes)) {
    return next(new AppError('Invalid account type', 'INVALID_PARAMETERS', 400));
  }

  next();
};
