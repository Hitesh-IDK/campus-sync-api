import User from './user-modal';
import { AccountTypes } from '../../../types/global';

export default class Instructor extends User {
  constructor(
    registrationId: string,
    name: string,
    phone: number,
    password: string,
    accountType: AccountTypes,
    email?: string,
    photo?: string,
    description?: string,
    updatedAt?: Date,
    createdAt?: Date
  ) {
    super(registrationId, name, phone, password, accountType, email, photo, description, updatedAt, createdAt);
  }
}
