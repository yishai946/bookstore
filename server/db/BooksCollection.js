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

  // get all books
  static async getAll(page = 1, limit = 10) {
    const booksCollection = this.instance().booksCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents
    const total = await booksCollection.countDocuments();

    // Retrieve the paginated results with author details
    const books = await booksCollection
      .aggregate([
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
      ])
      .toArray();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Return results along with pagination metadata
    return {
      total,
      page,
      limit,
      totalPages,
      data: books,
    };
  }

  // get book by id
  static async get(id) {
    const booksCollection = this.instance().booksCollection;

    const book = await booksCollection
      .aggregate([
        { $match: { _id: id } },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
      ])
      .next();

    return book;
  }

  // get books by genre
  static async getByGenre(genre, page = 1, limit = 10) {
    const booksCollection = this.instance().booksCollection;

    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Retrieve the total count of documents matching the genre
    const total = await booksCollection.countDocuments({ genres: genre });

    // Retrieve the paginated results with author details
    const books = await booksCollection
      .aggregate([
        { $match: { genres: genre } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
      ])
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
    const objectIdArray = ids.map((id) => new ObjectId(id));

    // Retrieve books with author details
    const books = await this.instance()
      .booksCollection.aggregate([
        { $match: { _id: { $in: objectIdArray } } },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
          },
        },
      ])
      .toArray();

    return books;
  }

  // delete book by id
  static async delete(id) {
    await this.instance().booksCollection.deleteOne({ _id: id });
  }

  // update book by id
  static async update(id, book) {
    await this.instance().booksCollection.updateOne(
      { _id: id },
      { $set: book }
    );
  }

  // get all books genres
  static async getGenres() {
    const booksCollection = this.instance().booksCollection;

    // Retrieve distinct genres
    const genres = await booksCollection.distinct("genres");

    return genres;
  }
}

export default BooksCollection;
