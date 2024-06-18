import { objectId } from "mongodb";
import MongoDB from "./mongodb.js";

class BooksCollection {
  constructor() {
    this.booksCollection = MongoDB.instance().db().collection("books");
  }

  static instance() {
    if (!this._instance) {
      this._instance = new BooksCollection();
    }
    return this._instance;
  }

  static async create(book) {
    const result = await this.instance().booksCollection.insertOne(book);
    return result.insertedId;
  }
}

export default BooksCollection;
