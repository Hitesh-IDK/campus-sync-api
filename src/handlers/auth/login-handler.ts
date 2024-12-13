import { AbstractedUser, LoginReqBody, LoginResBody } from '../../../types/auth';
import { GenericAPIResponse, GenericReqHeaders } from '../../../types/global';
import User from '../../database/models/user-modal';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { password, phone } = req.body as LoginReqBody;
  const { 'x-account-type': accountType } = req.headers as unknown as GenericReqHeaders;

  const user = await User.getByPhone(Number(phone));

  if (!user) {
    return next(new AppError('User not found', 'INVALID_PARAMETERS', 404));
  }

  if (user.accountType !== accountType) {
    return next(new AppError('Invalid account type', 'INVALID_PARAMETERS', 400));
  }

  if (!(await user.checkPassword(password))) {
    return next(new AppError('Invalid password', 'INVALID_PARAMETERS', 400));
  }

  const abstractedUser: AbstractedUser = {
    id: user.id,
    registration_id: user.registrationId,
    name: user.name,
    phone: user.phone,
    email: user.email,
    photo: user.photo,
    account_type: user.accountType,
  };

  const accessToken = await user.generateToken('access');
  const refreshToken = await user.generateToken('refresh');
  const response: GenericAPIResponse<LoginResBody> = {
    success: true,
    code: 200,
    data: {
      user: abstractedUser,
      access_token: accessToken,
      refresh_token: refreshToken,
      message: 'Login successful',
    },
  };

  return res.status(200).json(response);
});

export const LoginBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { password, phone } = req.body as LoginReqBody;

  const missing: string[] = [];

  if (!password) missing.push('password');
  if (!phone) missing.push('phone');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  if (phone.toString().length > 10 || phone.toString().length < 10) {
    return next(new AppError('Phone must be 10 digits', 'INVALID_PARAMETERS', 400));
  }

  next();
};
