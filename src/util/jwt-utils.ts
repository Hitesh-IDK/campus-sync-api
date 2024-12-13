import { verify } from 'jsonwebtoken';
import { TokenDecoded, TokenTypes } from '../../types/jwt';
import User from '../database/models/user-modal';

export const verifyJwt = async (
  token: string,
  type: TokenTypes,
  phone?: number,
  accountId?: string
): Promise<{ success: boolean; message: string }> => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return {
      success: false,
      message: 'JWT secret not found',
    };
  }

  if (!token.startsWith('Bearer'))
    return {
      success: false,
      message: 'Invalid token format',
    };

  const slicedToken = token.split(' ')[1];
  const payload = (await jwtVerifyPromisified(slicedToken, secret)) as unknown as TokenDecoded;

  if (type === 'access' || type === 'refresh') {
    if (!accountId) return { success: false, message: 'Account ID not found' };

    const verification = await accessTokenVerify(secret, slicedToken, accountId, phone?.toString());
    if (!verification.success) return verification;
  } else if (type === 'recover') {
    if (!phone) return { success: false, message: 'Phone number not found' };

    const verification = await recoverTokenVerify(secret, slicedToken, phone.toString());
    if (!verification.success) return verification;
  }

  if (type !== (payload as TokenDecoded).type)
    return {
      success: false,
      message: 'Invalid token type, does not match the operation!',
    };

  return {
    success: true,
    message: 'Token verified successfully',
  };
};

const accessTokenVerify = async (
  secret: string,
  token: string,
  accountId: string,
  phone?: string
): Promise<{ success: boolean; message: string }> => {
  const payload: TokenDecoded = (await jwtVerifyPromisified(token, secret)) as unknown as TokenDecoded;
  // Get the USER if it exists
  const user = await User.getByPhone(Number(payload.phone));

  if (phone && payload.phone.toString() !== phone)
    return {
      success: false,
      message: 'Phone number does not belong to this JWT token',
    };

  if (!user)
    return {
      success: false,
      message: 'User linked to this JWT token does not exist',
    };

  if (user.deletedAt)
    return {
      success: false,
      message: 'User linked to this JWT token is deleted',
    };

  if (user.id !== accountId)
    return {
      success: false,
      message: 'User Id provided does not belong to this token',
    };

  return { success: true, message: 'Token verified successfully' };
};

const recoverTokenVerify = async (
  secret: string,
  token: string,
  phone: string
): Promise<{ success: boolean; message: string }> => {
  const payload: TokenDecoded = (await jwtVerifyPromisified(token, secret)) as unknown as TokenDecoded;
  // Get the USER if it exists
  const user = await User.getByPhone(Number(payload.phone));

  if (phone && payload.phone.toString() !== phone)
    return {
      success: false,
      message: 'Phone number does not belong to this JWT token',
    };

  if (!user)
    return {
      success: false,
      message: 'User linked to this JWT token does not exist',
    };

  if (!user.deletedAt)
    return {
      success: false,
      message: 'User linked to this JWT token is not deleted',
    };

  return { success: true, message: 'Token verified successfully' };
};

const jwtVerifyPromisified = async (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    verify(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};
