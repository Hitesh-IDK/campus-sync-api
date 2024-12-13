import { ObjectId } from 'mongodb';
import { mongoClient } from '../connection';
import { AbstractedClass, ClassDbBody } from '../../../types/class';
import Instructor from './instructor-model';
import Course from './course-model';
import User from './user-modal';

export default class Class {
  private _id: ObjectId;
  code: string;

  name: string;
  description: string;

  insturctor: ObjectId;
  courses: ObjectId[];
  students: ObjectId[];

  get id() {
    return this._id;
  }

  constructor(
    code: string,
    name: string,
    description: string,
    insturctor: ObjectId,
    courses: ObjectId[],
    students: ObjectId[],
    id?: ObjectId
  ) {
    this.code = code;
    this.name = name;
    this.description = description;

    this.insturctor = insturctor;
    this.courses = courses;
    this.students = students;

    if (id) this._id = id;
  }

  async save(): Promise<ObjectId | undefined> {
    const result = await mongoClient.db().collection('classes').insertOne({
      code: this.code,
      name: this.name,
      description: this.description,
      insturctor: this.insturctor,
      courses: this.courses,
      students: this.students,
    });

    this._id = result.insertedId;

    return result.insertedId;
  }

  async update(): Promise<void> {
    await mongoClient
      .db()
      .collection('classes')
      .updateOne(
        { _id: this._id },
        {
          $set: {
            code: this.code,
            name: this.name,
            description: this.description,
            insturctor: this.insturctor,
            courses: this.courses,
            students: this.students,
          },
        }
      );
  }

  async delete(): Promise<void> {
    await mongoClient.db().collection('classes').deleteOne({ _id: this._id });
  }

  static async getById(id: ObjectId): Promise<Class | null> {
    const data = await mongoClient.db().collection<ClassDbBody>('classes').findOne({ _id: id });

    if (!data) return null;
    return new Class(data.code, data.name, data.description, data.insturctor, data.courses, data.students, data._id);
  }

  static async getByCode(code: string): Promise<Class | null> {
    const data = await mongoClient.db().collection<ClassDbBody>('classes').findOne({ code });

    if (!data) return null;
    return new Class(data.code, data.name, data.description, data.insturctor, data.courses, data.students, data._id);
  }

  static async getByIds(ids: ObjectId[]): Promise<AbstractedClass[]> {
    const data = await mongoClient
      .db()
      .collection<ClassDbBody>('classes')
      .find({ _id: { $in: ids } })
      .toArray();
    return await Promise.all(
      data.map(async (item) => ({
        id: item._id.toString(),
        code: item.code,
        name: item.name,
        description: item.description,
        insturctor: (await Instructor.getById(item.insturctor.toString()))?.toAbstractedUser(),
        courses: await Course.getByIds(item.courses),
        students: await User.getByIds(item.students),
      }))
    );
  }

  static async getAll(): Promise<ClassDbBody[]> {
    const data = await mongoClient.db().collection<ClassDbBody>('classes').find().toArray();
    return data.map((item) => ({
      id: item._id.toString(),
      code: item.code,
      name: item.name,
      description: item.description,
      insturctor: item.insturctor,
      courses: item.courses,
      students: item.students,
    }));
  }

  async toJavaScriptObject(): Promise<AbstractedClass> {
    return {
      id: this._id.toString(),
      code: this.code,
      name: this.name,
      description: this.description,
      insturctor: (await Instructor.getById(this.insturctor.toString()))?.toAbstractedUser(),
      courses: await Course.getByIds(this.courses),
      students: await User.getByIds(this.students),
    };
  }

  static async validateCode(code: string): Promise<string | undefined> {
    if (code.length < 3 || code.length > 50) return 'Code must be between 3 and 50 characters';
    if (await Class.getByCode(code)) return 'Code already in use';

    return undefined;
  }

  static validateName(name: string): string | undefined {
    if (name.length < 3 || name.length > 50) return 'Name must be between 3 and 50 characters';
  }

  static validateDescription(description: string): string | undefined {
    if (description.length < 3 || description.length > 500) return 'Description must be between 3 and 500 characters';
  }

  static async validateInstructor(insturctor: ObjectId): Promise<string | undefined> {
    if (!insturctor) return 'Insturctor is required';
    if (!(await Instructor.getById(insturctor.toString()))) return 'Insturctor does not exist';
  }
}
