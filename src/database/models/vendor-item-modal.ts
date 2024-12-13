import { ObjectId } from 'mongodb';
import { mongoClient } from '../connection';
import { VendorDbBody } from '../../../types/vendor';

export default class VendorItem {
  private _id?: ObjectId;

  name: string;
  description: string;
  price: number;
  photo: string;
  vendorId: ObjectId;

  constructor(name: string, description: string, price: number, photo: string, vendorId: ObjectId, id?: ObjectId) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.photo = photo;
    this.vendorId = vendorId;

    if (id) this._id = id;
  }

  get id() {
    return this._id;
  }

  async save(): Promise<void> {
    const result = await mongoClient.db().collection('vendor_items').insertOne({
      name: this.name,
      description: this.description,
      price: this.price,
      photo: this.photo,
      vendorId: this.vendorId,
    });
    this._id = result.insertedId;
  }

  async delete(): Promise<boolean> {
    const result = await mongoClient.db().collection('vendor_items').deleteOne({ _id: this.id });
    return result.deletedCount > 0;
  }

  async update(): Promise<boolean> {
    const result = await mongoClient
      .db()
      .collection('vendor_items')
      .updateOne(
        { _id: this.id },
        {
          $set: {
            name: this.name,
            description: this.description,
            price: this.price,
            photo: this.photo,
          },
        }
      );
    return result.modifiedCount > 0;
  }

  static async getAllByVendor(vendorId: ObjectId): Promise<VendorDbBody[]> {
    const data = await mongoClient.db().collection('vendor_items').find({ vendorId }).toArray();
    return data.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      photo: item.photo,
      description: item.description,
      price: item.price,
    }));
  }

  static async getById(id: string): Promise<VendorItem | null> {
    const data = await mongoClient
      .db()
      .collection('vendor_items')
      .findOne({ _id: new ObjectId(id) });
    if (!data) return null;
    return new VendorItem(data.name, data.description, data.price, data.photo, data.vendorId, data._id);
  }
}
