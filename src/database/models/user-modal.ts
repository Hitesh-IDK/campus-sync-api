import { sign } from 'jsonwebtoken';
import { TokenPayload } from '../../../types/jwt';
import { mongoClient } from '../connection';
import { compareSync } from 'bcrypt';
import { AccountTypes } from '../../../types/global';
import { hashPassword } from '../../util/cryptography';
import { ObjectId } from 'mongodb';
import { AbstractedUser, UserDbBody } from '../../../types/auth';
import { isEmail } from 'validator';

export default class User {
  private _id?: string;
  registrationId: string;

  name: string;
  phone: number;
  email?: string;
  password: string;
  photo?: string;
  qualification?: string;

  accountType: AccountTypes;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;

  get id() {
    return this._id;
  }

  constructor(
    registrationId: string,
    name: string,
    phone: number,
    password: string,
    accountType: AccountTypes,
    qualification?: string,
    email?: string,
    photo?: string,
    updatedAt?: Date,
    deletedAt?: Date,
    createdAt?: Date,
    id?: string
  ) {
    this.registrationId = registrationId;
    this.name = name;
    this.phone = phone;
    this.password = password;
    this.accountType = accountType;

    if (email) this.email = email;
    if (photo) this.photo = photo;
    if (qualification) this.qualification = qualification;

    this.updatedAt = updatedAt ? updatedAt : new Date();
    this.createdAt = createdAt ? createdAt : new Date();
    if (deletedAt) this.deletedAt = deletedAt;

    if (id) this._id = id;
  }

  async save(): Promise<string> {
    const hashed = await hashPassword(this.password);

    const result = await mongoClient.db().collection('users').insertOne({
      registrationId: this.registrationId,
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: hashed,
      photo: this.photo,
      qualification: this.qualification,
      accountType: this.accountType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });

    this._id = result.insertedId.toString();
    return result.insertedId.toString();
  }

  async update(): Promise<boolean> {
    const result = await mongoClient
      .db()
      .collection<UserDbBody>('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        {
          $set: {
            registrationId: this.registrationId,
            name: this.name,
            phone: this.phone,
            email: this.email,
            photo: this.photo,
            qualification: this.qualification,
            accountType: this.accountType,
            updatedAt: new Date(),
          },
        }
      );
    return result.modifiedCount > 0;
  }

  async checkPassword(password: string): Promise<boolean> {
    return compareSync(password, this.password);
  }

  /*
   * Generate access and refresh tokens
   */

  async generateToken(type: 'access' | 'refresh' | 'recover'): Promise<string | undefined> {
    const secret = process.env.JWT_SECRET;
    const accessExpiresIn = process.env.JWT_EXPIRY_ACCESS;
    const refreshExpiresIn = process.env.JWT_EXPIRY_REFRESH;
    const recoverExpiresIn = process.env.JWT_EXPIRY_RECOVER;

    const payload: TokenPayload = {
      phone: this.phone.toString(),
      type,
    };

    if (!secret) return undefined;

    const expiresIn = type === 'access' ? accessExpiresIn : type === 'refresh' ? refreshExpiresIn : recoverExpiresIn;
    if (!expiresIn) return undefined;

    const token = sign(payload, secret, {
      expiresIn,
    });
    return `Bearer ${token}`;
  }

  /*
   * Soft delete the user
   */

  async delete(): Promise<boolean> {
    const result = await mongoClient
      .db()
      .collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { deletedAt: new Date() } });

    return result.modifiedCount > 0;
  }

  /*
   * Recover the user
   */

  async recover(): Promise<boolean> {
    if (!this.deletedAt) return false;

    const result = await mongoClient
      .db()
      .collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { deletedAt: null } });

    return result.modifiedCount > 0;
  }

  /*
   * Get the user from the database by id
   */

  static async getById(getId: string): Promise<User | undefined> {
    const data = await mongoClient
      .db()
      .collection<UserDbBody>('users')
      .findOne({ _id: new ObjectId(getId) });

    if (!data) return undefined;

    const {
      registrationId,
      name,
      qualification,
      phone,
      email,
      password,
      photo,
      accountType,
      _id,
      deletedAt,
      updatedAt,
      createdAt,
    } = data;

    return new User(
      registrationId,
      name,
      phone,
      password,
      accountType,
      qualification,
      email,
      photo,
      updatedAt,
      deletedAt,
      createdAt,
      _id.toString()
    );
  }

  static async getByIds(getIds: ObjectId[]): Promise<AbstractedUser[]> {
    const data = await mongoClient
      .db()
      .collection<UserDbBody>('users')
      .find({ _id: { $in: getIds } })
      .toArray();

    return data.map((item) => ({
      id: item._id.toString(),
      registration_id: item.registrationId,
      account_type: item.accountType,
      name: item.name,
      phone: item.phone,
      email: item.email,
      photo: item.photo,
      qualification: item.qualification,
      accountType: item.accountType,
    }));
  }

  /*
   * Get the user from the database by phone
   */

  static async getByPhone(getPhone: number): Promise<User | undefined> {
    const data = await mongoClient.db().collection<UserDbBody>('users').findOne({ phone: getPhone });

    if (!data) return undefined;

    const {
      registrationId,
      name,
      phone,
      email,
      password,
      photo,
      qualification,
      accountType,
      _id,
      deletedAt,
      updatedAt,
      createdAt,
    } = data;

    return new User(
      registrationId,
      name,
      phone,
      password,
      accountType,
      qualification,
      email,
      photo,
      updatedAt,
      deletedAt,
      createdAt,
      _id.toString()
    );
  }
  /*
   * Get users from the database by account type
   */
  static async getByAccountType(accountType: AccountTypes): Promise<AbstractedUser[]> {
    const data = await mongoClient.db().collection<UserDbBody>('users').find({ accountType }).toArray();

    return data.map(
      ({ registrationId, name, qualification, phone, email, photo, accountType, _id }): AbstractedUser => ({
        id: _id.toString(),
        registration_id: registrationId,
        name,
        qualification,
        phone,
        email,
        photo,
        account_type: accountType,
      })
    );
  }

  /*
   * Convert User object to AbstractedUser object
   */
  toAbstractedUser(): AbstractedUser {
    return {
      id: this._id || '',
      registration_id: this.registrationId,
      name: this.name,
      qualification: this.qualification,
      phone: this.phone,
      email: this.email || '',
      photo: this.photo || '',
      account_type: this.accountType,
    };
  }

  static validateName(name: string): string | undefined {
    if (name.length < 3 || name.length > 50) return 'Name must be between 3 and 50 characters';
  }

  static validatePhone(phone: number): string | undefined {
    if (phone.toString().length !== 10) return 'Phone number must be 10 digits long';
    if (typeof phone !== 'number') return 'Phone number must be a number';
  }

  static validateEmail(email: string): string | undefined {
    if (email.length < 3 || email.length > 50) return 'Email must be between 3 and 50 characters';
    if (!isEmail(email)) return 'Email is not valid';
  }

  static validateRegistrationId(registrationId: string): string | undefined {
    if (registrationId.length < 3 || registrationId.length > 50)
      return 'Registration ID must be between 3 and 50 characters';
  }
}
