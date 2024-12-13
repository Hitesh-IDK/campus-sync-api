import { ObjectId } from 'mongodb';
import { mongoClient } from '../connection';
import { AbstractedDepartment, DepartmentDbBody } from '../../../types/department';
import User from './user-modal';

export default class Department {
  private _id?: ObjectId;

  name: string;
  description: string;
  handler: ObjectId;
  instructors: ObjectId[];
  students: ObjectId[];
  classes: ObjectId[];

  constructor(
    name: string,
    description: string,
    handler: ObjectId,
    instructors: ObjectId[],
    classes: ObjectId[],
    id?: ObjectId
  ) {
    this.name = name;
    this.description = description;
    this.handler = handler;
    this.instructors = instructors;
    this.classes = classes;

    if (id) this._id = id;
  }

  get id(): ObjectId | undefined {
    return this._id;
  }

  async save(): Promise<void> {
    const result = await mongoClient.db().collection('departments').insertOne({
      name: this.name,
      description: this.description,
      handler: this.handler,
      instructors: this.instructors,
      classes: this.classes,
    });

    this._id = result.insertedId;
  }

  async update(): Promise<void> {
    await mongoClient
      .db()
      .collection('departments')
      .updateOne(
        { _id: this._id },
        {
          $set: {
            name: this.name,
            description: this.description,
            instructors: this.instructors,
            handler: this.handler,
            classes: this.classes,
          },
        }
      );
  }

  async delete(): Promise<void> {
    const user = await User.getById(this.handler.toString());
    user.accountType = 'instructor';

    await user.update();

    await mongoClient.db().collection('departments').deleteOne({ _id: this._id });
  }

  static async getById(id: string): Promise<Department | null> {
    const data = await mongoClient
      .db()
      .collection('departments')
      .findOne({ _id: new ObjectId(id) });
    if (!data) return null;

    return new Department(data.name, data.description, data.handler, data.instructors, data.classes, data._id);
  }

  static async getAll(): Promise<AbstractedDepartment[]> {
    const data = await mongoClient.db().collection<DepartmentDbBody>('departments').find().toArray();

    return Promise.all(
      data.map(async (item) => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        handler: (await User.getById(item.handler.toString())).toAbstractedUser(),
        instructors: await Promise.all(
          item.instructors.map(async (instructor: ObjectId) =>
            (await User.getById(instructor.toString())).toAbstractedUser()
          )
        ),
      }))
    );
  }

  async toJavaScriptObject(): Promise<AbstractedDepartment> {
    return {
      id: this._id?.toString(),
      name: this.name,
      description: this.description,
      handler: (await User.getById(this.handler.toString())).toAbstractedUser(),
      instructors: await Promise.all(
        this.instructors.map(async (instructor: ObjectId) =>
          (await User.getById(instructor.toString())).toAbstractedUser()
        )
      ),
    };
  }

  static validateName(name: string): string | undefined {
    if (name.length < 3 || name.length > 50) return 'Name must be between 3 and 50 characters';
  }

  static validateDescription(description: string): string | undefined {
    if (description.length < 3 || description.length > 500) return 'Description must be between 3 and 500 characters';
  }

  static async validateHandler(handler: ObjectId): Promise<string | undefined> {
    const result = await mongoClient.db().collection('users').findOne({ _id: handler });
    console.log(result);
    if (!result) return 'Handler not found';
    if (result.accountType === 'department_spoc') return 'Invalid handler, handler is already binded to a department';
    if (result.accountType !== 'instructor') return 'Invalid handler, only instructors can be used as handler';

    return undefined;
  }
}
