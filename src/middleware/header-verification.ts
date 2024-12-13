import { NextFunction, Request, Response } from 'express';
import { AppError, catchAsync } from './error-middleware';
import { AuthorizedReqHeaders, GenericReqHeaders, RefreshReqHeaders, VerifyReqHeaders } from '../../types/global';
import { verifyJwt } from '../util/jwt-utils';
import User from '../database/models/user-modal';

export const GenericHeaderVerification = (req: Request, res: Response, next: NextFunction) => {
  const { 'x-account-type': accountType } = req.headers as unknown as GenericReqHeaders;

  if (!accountType) return next(new AppError('Missing required fields! - x-account-type', 'MISSING_FIELDS', 400));

  if (
    accountType !== 'student' &&
    accountType !== 'instructor' &&
    accountType !== 'admin' &&
    accountType !== 'vendor' &&
    accountType !== 'department_spoc' &&
    accountType !== 'institution_spoc'
  )
    return next(new AppError('Invalid account type!', 'INVALID_PARAMETERS', 400));

  next();
};

export const AuthorizedHeaderVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    'x-access-token': accessToken,
    'x-account-id': accountId,
    'x-account-type': accountType,
  }: AuthorizedReqHeaders = req.headers as unknown as AuthorizedReqHeaders;
  // // Maybe Phone availabled on certain Authorized Req Body
  // const { phone } = req.body as unknown as { phone?: number };

  const missing: string[] = [];

  if (!accessToken) missing.push('x-access-token');
  if (!accountId) missing.push('x-account-id');
  if (!accountType) missing.push('x-account-type');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  if (
    accountType !== 'student' &&
    accountType !== 'instructor' &&
    accountType !== 'admin' &&
    accountType !== 'vendor' &&
    accountType !== 'department_spoc' &&
    accountType !== 'institution_spoc'
  )
    return next(new AppError('Invalid account type!', 'INVALID_PARAMETERS', 400));

  // Verify the access token
  const user = await User.getById(accountId);

  if (!user) return next(new AppError('User not found', 'INVALID_PARAMETERS', 404));
  const tokenVerification = await verifyJwt(accessToken, 'access', user.phone, accountId);

  if (user.accountType !== accountType) return next(new AppError('Invalid account type!', 'INVALID_PARAMETERS', 400));

  if (!tokenVerification.success) return next(new AppError(tokenVerification.message, 'AUTHENTICATION_ERROR', 401));

  next();
});

export const VerifyHeaderVerification = (req: Request, res: Response, next: NextFunction) => {
  const { 'x-account-type': accountType } = req.headers as unknown as VerifyReqHeaders;

  const missing: string[] = [];

  if (!accountType) missing.push('x-account-type');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  next();
};

export const RefreshHeaderVerification = (req: Request, res: Response, next: NextFunction) => {
  const { 'x-refresh-token': refreshToken, 'x-account-id': accountId } = req.headers as unknown as RefreshReqHeaders;

  const missing: string[] = [];

  if (!refreshToken) missing.push('x-refresh-token');
  if (!accountId) missing.push('x-account-id');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  next();
};
