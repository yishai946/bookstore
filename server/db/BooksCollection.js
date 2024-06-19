import MongoDB from "./MongoDB.js";

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

  static async add(book) {
    const result = await this.instance().booksCollection.insertOne(book);
    return result.insertedId;
  }

  static async getAll(){
    const books = await this.instance().booksCollection.find().toArray();
    return books;
  }

  static async get(id){
    const book = await this.instance().booksCollection.findOne({}, {_id: id})
    return book;
  }
}

export default BooksCollection;
