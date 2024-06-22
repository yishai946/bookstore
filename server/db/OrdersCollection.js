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

  static async getAll(page = 1, limit = 10) {
    const ordersCollection = this.instance().ordersCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents
    const total = await ordersCollection.countDocuments();

    // Retrieve the paginated results
    const orders = await ordersCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    // Return results along with pagination metadata
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: orders,
    };
  }

  // get order by id
  static async get(id) {
    const order = await this.instance().ordersCollection.findOne({
      _id: new ObjectId(id),
    });
    return order;
  }

  // Get orders between dates with pagination
  static async getBetweenDates(from, to, page = 1, limit = 10) {
    const ordersCollection = this.instance().ordersCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents matching the date range
    const total = await ordersCollection.countDocuments({
      date: {
        $gte: from,
        $lt: to,
      },
    });

    // Retrieve the paginated results
    const orders = await ordersCollection
      .find({
        date: {
          $gte: from,
          $lt: to,
        },
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Return results along with pagination metadata
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: orders,
    };
  }

  // Add order to database
  static async add(order) {
    const result = await this.instance().ordersCollection.insertOne(order);
    return result.insertedId;
  }

  // delete order by id
  static async delete(id) {
    await this.instance().ordersCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export default OrdersCollection;
