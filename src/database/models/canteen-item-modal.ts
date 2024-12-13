import { CanteenItemAbstracted, CanteenItemDbBody } from '../../../types/canteen';
import { mongoClient } from '../connection';
import { ObjectId } from 'mongodb';

export default class Canteen_Item {
  private _id?: ObjectId;

  name: string;
  description: string;
  price: number;
  type: string;
  photo: string;

  constructor(name: string, description: string, price: number, type: string, photo: string, id?: ObjectId) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.type = type;
    this.photo = photo;

    if (id) this._id = id;
  }

  get id() {
    return this._id;
  }

  async save(): Promise<void> {
    const result = await mongoClient.db().collection('canteen_items').insertOne({
      name: this.name,
      description: this.description,
      price: this.price,
      type: this.type,
      photo: this.photo,
    });
    this._id = result.insertedId;
  }

  async delete(): Promise<boolean> {
    const result = await mongoClient.db().collection('canteen_items').deleteOne({ _id: this.id });
    return result.deletedCount > 0;
  }

  async update(): Promise<boolean> {
    const result = await mongoClient
      .db()
      .collection('canteen_items')
      .updateOne(
        { _id: this.id },
        {
          $set: {
            name: this.name,
            description: this.description,
            price: this.price,
            type: this.type,
            photo: this.photo,
          },
        }
      );
    return result.modifiedCount > 0;
  }

  static async getAll(): Promise<CanteenItemDbBody[]> {
    const data = await mongoClient.db().collection('canteen_items').find().toArray();

    return data.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      type: item.type,
      photo: item.photo,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }

  static toAbstract(item: CanteenItemDbBody): CanteenItemAbstracted {
    return {
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      type: item.type,
      photo: item.photo,
    };
  }

  static async getById(id: string): Promise<Canteen_Item | null> {
    const data = await mongoClient
      .db()
      .collection('canteen_items')
      .findOne({ _id: new ObjectId(id) });
    if (!data) return null;
    return new Canteen_Item(data.name, data.description, data.price, data.type, data.photo, data._id);
  }
}
