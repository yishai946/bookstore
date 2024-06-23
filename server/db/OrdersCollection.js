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

  static async get(id) {
    const order = await this.instance().ordersCollection.findOne({
      _id: id,
    });
    return order;
  }

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

    return result[0] || null;
  }

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

    return result[0]?.totalProfit || 0;
  }

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

    return result.length > 0
      ? { bookId: result[0]._id, totalQuantity: result[0].totalQuantity }
      : null;
  }

  static async getMostPopularAuthor() {
    const result = await this.instance()
      .ordersCollection.aggregate([
        {
          $unwind: "$books",
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

  static async add(order) {
    const result = await this.instance().ordersCollection.insertOne(order);
    return result.insertedId;
  }

  static async delete(id) {
    await this.instance().ordersCollection.deleteOne({ _id: id });
  }
}

export default OrdersCollection;
