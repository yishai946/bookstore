import { ObjectId } from "mongodb";
import MongoDB from "./MongoDB.js";

class BooksCollection {
  constructor() {
    this.booksCollection = MongoDB.instance().db().collection("books");
  }

  // Singleton instance
  static instance() {
    if (!this._instance) {
      this._instance = new BooksCollection();
    }
    return this._instance;
  }

  // Add book to database
  static async add(book) {
    const result = await this.instance().booksCollection.insertOne(book);
    return result.insertedId;
  }

  static async getAll(page = 1, limit = 10) {
    const booksCollection = this.instance().booksCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents
    const total = await booksCollection.countDocuments();

    // Retrieve the paginated results
    const books = await booksCollection
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
      data: books,
    };
  }

  // get book by id
  static async get(id) {
    const book = await this.instance().booksCollection.findOne({
      _id: new ObjectId(id),
    });
    return book;
  }

  // get books by genre
  static async getByGenre(genre, page = 1, limit = 10) {
    const booksCollection = this.instance().booksCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents matching the genre
    const total = await booksCollection.countDocuments({ genres: genre });

    // Retrieve the paginated results
    const books = await booksCollection
      .find({ genres: genre })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Return results along with pagination metadata
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: books,
    };
  }

  // get books by ids
  static async getBooks(ids) {
    // make the ids to object ids
    ids = ids.map((id) => new ObjectId(id));
    const books = await this.instance()
      .booksCollection.find({ _id: { $in: ids } })
      .toArray();
    return books;
  }

  // delete book by id
  static async delete(id) {
    await this.instance().booksCollection.deleteOne({ _id: new ObjectId(id) });
  }

  // update book by id
  static async update(id, book) {
    await this.instance().booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: book }
    );
  }
}

export default BooksCollection;
