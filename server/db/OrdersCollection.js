import { ObjectId } from "mongodb";
import MongoDB from "./MongoDB.js";

class OrdersCollection {
  constructor() {
    this.ordersCollection = MongoDB.instance().db().collection("orders");
  }

  // Singleton instance
  static instance() {
    if (!this._instance) {
      this._instance = new OrdersCollection();
    }
    return this._instance;
  }

  // Add order to database
  static async add(order) {
    const result = await this.instance().ordersCollection.insertOne(order);
    return result.insertedId;
  }

  // Get all orders from database
  static async getAll() {
    const orders = await this.instance().ordersCollection.find().toArray();
    return orders;
  }

  // get order by id
  static async get(id) {
    const order = await this.instance().ordersCollection.findOne({
      _id: new ObjectId(id),
    });
    return order;
  }

  // delete order by id
  static async delete(id) {
    await this.instance().ordersCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export default OrdersCollection;
