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

  // get orders between dates with pagination
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

  // get all-time highest profit day
  static async getHighestProfitDay() {
    const result = await this.instance()
      .ordersCollection.aggregate([
        {
          $group: {
            _id: "$date",
            totalSales: {
              $sum: "$total",
            },
          },
        },
        {
          $sort: {
            totalSales: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    return result[0] || null; // Return the highest profit day or null if no results
  }

  // get total profit between dates
  static async getTotalProfitBetweenDates(from, to) {
    const result = await this.instance()
      .ordersCollection.aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalProfit: {
              $sum: "$total",
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalProfit: 1,
          },
        },
      ])
      .toArray();

    return result[0]?.totalProfit || 0; // Return the total profit or 0 if no results
  }

  // get most popular book
  static async getMostPopularBook() {
    const result = await this.instance()
      .ordersCollection.aggregate([
        {
          $unwind: "$books",
        },
        {
          $group: {
            _id: "$books.id",
            totalQuantity: {
              $sum: "$books.quantity",
            },
          },
        },
        {
          $sort: {
            totalQuantity: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    // If there's a result, return the book ID and total quantity, otherwise return null
    return result.length > 0
      ? { bookId: result[0]._id, totalQuantity: result[0].totalQuantity }
      : null;
  }

  // get most popular author
  static async getMostPopularAuthor() {
    const result = await this.instance()
      .ordersCollection.aggregate([
        {
          $unwind: "$books",
        },
        {
          $addFields: {
            "books.id": { $toObjectId: "$books.id" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "books.id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $group: {
            _id: "$bookDetails.author",
            totalQuantity: { $sum: "$books.quantity" },
          },
        },
        {
          $sort: {
            totalQuantity: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    return result.length > 0
      ? { author: result[0]._id, totalQuantity: result[0].totalQuantity }
      : null;
  }

  // gte most popular genres between dates
  static async getMostPopularGenres(from, to) {
    const result = await this.instance()
      .ordersCollection.aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to,
            },
          },
        },
        {
          $unwind: "$books",
        },
        {
          $addFields: {
            "books.id": { $toObjectId: "$books.id" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "books.id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $unwind: "$bookDetails.genres",
        },
        {
          $group: {
            _id: "$bookDetails.genres",
            totalQuantity: { $sum: "$books.quantity" },
          },
        },
        {
          $sort: {
            totalQuantity: -1,
          },
        },
        {
          $limit: 3,
        },
      ])
      .toArray();

    return result;
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
