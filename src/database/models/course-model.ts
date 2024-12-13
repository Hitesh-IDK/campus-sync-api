import { ObjectId } from 'mongodb';
import { mongoClient } from '../connection';
import { AbstractedCourse, CourseDbBody } from '../../../types/course';
import Instructor from './instructor-model';
import { UserDbBody } from '../../../types/auth';

export default class Course {
  private _id?: ObjectId;
  name: string;
  code: string;
  description: string;

  handler: ObjectId;

  constructor(name: string, code: string, description: string, handler: ObjectId, id?: ObjectId) {
    this.name = name;
    this.code = code;
    this.description = description;
    this.handler = handler;

    if (id) this._id = id;
  }

  get id(): ObjectId | undefined {
    return this._id;
  }

  async save(): Promise<void> {
    const result = await mongoClient.db().collection('courses').insertOne({
      name: this.name,
      code: this.code,
      description: this.description,
      handler: this.handler,
    });
    this._id = result.insertedId;
  }

  static async getById(id: string): Promise<Course | null> {
    const data = await mongoClient
      .db()
      .collection('courses')
      .findOne({ _id: new ObjectId(id) });
    if (!data) return null;
    return new Course(data.name, data.code, data.description, data.handler, data._id);
  }

  static async getByCode(code: string): Promise<Course | null> {
    const data = await mongoClient.db().collection('courses').findOne({ code });
    if (!data) return null;
    return new Course(data.name, data.code, data.description, data.handler, data._id);
  }

  static async getByIds(ids: ObjectId[]): Promise<AbstractedCourse[]> {
    const data = await mongoClient
      .db()
      .collection('courses')
      .find({ _id: { $in: ids } })
      .toArray();

    return data.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      code: item.code,
      handler: item.handler,
    }));
  }

  static async getAll(): Promise<AbstractedCourse[]> {
    const data = await mongoClient.db().collection<CourseDbBody>('courses').find().toArray();
    return await Promise.all(
      data.map(async (item) => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        code: item.code,
        handler: (await Instructor.getById(item.handler.toString()))?.toAbstractedUser(),
      }))
    );
  }

  static validateName(name: string): string | undefined {
    if (name.length < 3 || name.length > 50) return 'Name must be between 3 and 50 characters';
  }

  static validateDescription(description: string): string | undefined {
    if (description.length < 3 || description.length > 500) return 'Description must be between 3 and 500 characters';
  }

  static async validateCode(code: string): Promise<string | undefined> {
    if (code.length < 3 || code.length > 50) return 'Code must be between 3 and 50 characters';

    const result = await mongoClient.db().collection('courses').findOne({ code });
    if (result) return 'Code already in use';

    return undefined;
  }

  static async validateHandler(handler: ObjectId): Promise<string | undefined> {
    const result = await mongoClient.db().collection<UserDbBody>('users').findOne({ _id: handler });
    if (!result) return 'Handler not found';
    if (result.accountType !== 'instructor') return 'Invalid handler, only instructors can be used as handler';

    return undefined;
  }
}
