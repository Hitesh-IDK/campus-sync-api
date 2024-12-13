import { GenericAPIResponse, RefreshReqHeaders } from '../../../types/global';
import { RefreshReqBody, RefreshResBody } from '../../../types/user';
import User from '../../database/models/user-modal';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../util/jwt-utils';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body as RefreshReqBody;
  const { 'x-account-id': accountId, 'x-refresh-token': refreshToken } = req.headers as unknown as RefreshReqHeaders;

  const user = await User.getByPhone(Number(phone));
  if (!user) return next(new Error('User not found'));

  // Verify the refresh token
  const isVerified = await verifyJwt(refreshToken, 'refresh', phone, accountId);
  if (!isVerified.success) return next(new AppError(isVerified.message, 'AUTHENTICATION_ERROR', 401));

  const accessToken = await user.generateToken('access');
  const response: GenericAPIResponse<RefreshResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Refreshed access token successfully',
      access_token: accessToken,
    },
  };

  return res.status(200).json(response);
});

export const RefreshBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body as RefreshReqBody;

  const missing: string[] = [];

  if (!phone) missing.push('phone');

  if (missing.length > 0) {
    return next(new Error(`Missing required fields! - ${missing.join(', ')}`));
  }

  if (phone.toString().length > 10 || phone.toString().length < 10) {
    return next(new Error('Phone must be 10 digits'));
  }

  next();
};
