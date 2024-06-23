import { ObjectId } from "mongodb";
import MongoDB from "./MongoDB.js";

class AuthorsCollection {
  constructor() {
    this.authorsCollection = MongoDB.instance().db().collection("authors");
  }

  // Singleton instance
  static instance() {
    if (!this._instance) {
      this._instance = new AuthorsCollection();
    }
    return this._instance;
  }

  // Add author to database
  static async add(author) {
    const result = await this.instance().authorsCollection.insertOne(author);
    return result.insertedId;
  }

  // Get all authors from database
  static async getAll(page = 1, limit = 10) {
    const authorsCollection = this.instance().authorsCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents
    const total = await authorsCollection.countDocuments();

    // Retrieve the paginated results
    const orders = await authorsCollection
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
  
  // get author by id
static async get(id) {
    const author = await this.instance().authorsCollection.findOne({
      _id: id,
    });
    return author;
  }

  // get authors by ids
  static async getAuthors(ids) {
    // make the ids to object ids
    ids = ids.map((id) => new ObjectId(id));
    const authors = await this.instance()
      .authorsCollection.find({ _id: { $in: ids } })
      .toArray();
    return authors;
  }

  // delete author by id
  static async delete(id) {
    await this.instance().authorsCollection.deleteOne({
      _id: new ObjectId(id),
    });
  }

  // update author by id
  static async update(id, author) {
    await this.instance().authorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: author }
    );
  }
}

export default AuthorsCollection;
