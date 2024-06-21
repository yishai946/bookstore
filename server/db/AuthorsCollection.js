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
  static async getAll() {
    const authors = await this.instance().authorsCollection.find().toArray();
    return authors;
  }

  // get author by id
  static async get(id) {
    const author = await this.instance().authorsCollection.findOne({
      _id: new ObjectId(id),
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
    await this.instance().authorsCollection.deleteOne({ _id: new ObjectId(id) });
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
