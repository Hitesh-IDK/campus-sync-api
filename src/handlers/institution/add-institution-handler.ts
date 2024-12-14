import { AddInstitutionReqBody } from '../../../types/institution';
import Institution from '../../database/models/institution-model';
import User from '../../database/models/user-modal';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';
import { hashPassword } from '../../util/cryptography';
import { ObjectId } from 'mongodb';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, city, state, handler, image } = req.body as AddInstitutionReqBody;
  const { name: handlerName, qualification, phone, email } = handler;

  const hashedPassword = await hashPassword(phone.toString());
  const handlerUser = new User(
    phone.toString(),
    handlerName,
    phone,
    hashedPassword,
    'institution_spoc',
    qualification,
    email
  );
  const handlerId = await handlerUser.save();

  if (!handlerId) {
    return next(new AppError('Error creating handler', 'UNCAUGHT_ERROR', 500));
  }

  const newInstitution = new Institution(name, address, city, state, new ObjectId(handlerId), [], image);
  const institutionId = await newInstitution.save();

  if (!institutionId) {
    return next(new AppError('Error creating institution', 'UNCAUGHT_ERROR', 500));
  }

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 201,
    data: {
      message: 'Institution created successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const AddInstitutionBodyValidator = (req: Request, res: Response, next: NextFunction) => {
  const { name, address, city, state, handler } = req.body as AddInstitutionReqBody;
  const { name: handlerName, qualification, phone, email } = handler;

  const missing: string[] = [];

  if (!name) missing.push('name');
  if (!address) missing.push('address');
  if (!city) missing.push('city');
  if (!state) missing.push('state');
  if (!handlerName) missing.push('handlerName');
  if (!qualification) missing.push('qualification');
  if (!phone) missing.push('phone');
  if (!email) missing.push('email');

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields! - ${missing.join(', ')}`, 'MISSING_FIELDS', 400));
  }

  const errors: string[] = [];

  const validateName = Institution.validateName(name);
  const validateAddress = Institution.validateAddress(address);
  const validateCity = Institution.validateCity(city);
  const validateState = Institution.validateState(state);
  const validateHandlerName = Institution.validateName(handlerName);
  const validatePhone = User.validatePhone(phone);
  const vallidateEmail = User.validateEmail(email);

  if (validateName) errors.push(validateName);
  if (validateAddress) errors.push(validateAddress);
  if (validateCity) errors.push(validateCity);
  if (validateState) errors.push(validateState);
  if (validateHandlerName) errors.push(validateHandlerName);
  if (validatePhone) errors.push(validatePhone);
  if (vallidateEmail) errors.push(vallidateEmail);

  if (errors.length > 0) {
    return next(new AppError(`Invalid fields! - ${errors.join(', ')}`, 'INVALID_PARAMETERS', 400));
  }

  next();
};
