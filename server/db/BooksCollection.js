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

  // Get all books from database
  static async getAll(){
    const books = await this.instance().booksCollection.find().toArray();
    return books;
  }

  // get book by id
  static async get(id){
    const book = await this.instance().booksCollection.findOne({_id: new ObjectId(id)})
    return book;
  }

  // get books by ids
  static async getBooks(ids){
    const books = await this.instance().booksCollection.find({_id: {$in: ids}}).toArray();
    return books;
  }

  // delete book by id
  static async delete(id){
    await this.instance().booksCollection.deleteOne({_id: new ObjectId(id)});
  }

  // update book by id
  static async update(id, book){
    await this.instance().booksCollection.updateOne({_id: new ObjectId(id)}, {$set: book});
  }
}

export default BooksCollection;
