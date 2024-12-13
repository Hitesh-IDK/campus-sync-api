import { ObjectId } from 'mongodb';
import { mongoClient } from '../connection';

export default class Institution {
  private _id?: ObjectId;

  name: string;
  address: string;
  city: string;
  state: string;
  image?: string;

  handler: ObjectId;
  departments: ObjectId[];

  get id() {
    return this._id;
  }

  constructor(
    name: string,
    address: string,
    city: string,
    state: string,
    handler: ObjectId,
    departments: ObjectId[],
    image?: string,
    id?: ObjectId
  ) {
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.handler = handler;
    this.departments = departments;

    if (image) this.image = image;
    if (id) this._id = id;
  }

  async save(): Promise<ObjectId> {
    const result = await mongoClient.db().collection('institutions').insertOne({
      name: this.name,
      address: this.address,
      city: this.city,
      state: this.state,
      handler: this.handler,
      departments: this.departments,
      image: this.image,
    });

    this._id = result.insertedId;
    return result.insertedId;
  }

  static validateName(name: string): string | undefined {
    if (name.length < 3 || name.length > 50) return 'Name must be between 3 and 50 characters';
  }

  static validateAddress(address: string): string | undefined {
    if (address.length < 3 || address.length > 50) return 'Address must be between 3 and 50 characters';
  }

  static validateCity(city: string): string | undefined {
    if (city.length < 3 || city.length > 50) return 'City must be between 3 and 50 characters';
  }

  static validateState(state: string): string | undefined {
    if (state.length < 3 || state.length > 50) return 'State must be between 3 and 50 characters';
  }
}
