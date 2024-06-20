import BooksCollection from "../db/BooksCollection.js";

const booksFunctions = {
  // Add book to database
  add: async (req, res) => {
    try {
      const book = req.body;
      const currentYear = new Date().getFullYear();

    //   Check if book data is valid
      if (
        book.title == "" ||
        book.year < 1500 ||
        book.year > currentYear ||
        book.author == "" ||
        book.genres.length == 0 ||
        book.pages < 1 || 
        book.price <= 0 || 
        book.stock < 0
      ) {
        throw new Error("Invalid book data");
      }

    //   Check if genres are empty
      book.genres.forEach((genre) => {
        if (genre === "") {
          throw new Error("Genre cannot be empty");
        }
      });

    //   add book to database
      const id = await BooksCollection.add(book);
      res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    // Get all books from database
    getAll: async (req, res) => {
        try{
            const books = await BooksCollection.getAll();
            res.status(200).json(books);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // get books by ids
    getBooks: async (req, res) => {
        try {
            const ids = req.body;
            const books = await BooksCollection.getBooks(ids);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // get book by id
    get: async (req, res) => {
        try {
            const id = req.params.id;
            const book = await BooksCollection.get(id);
            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // delete book by id
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            await BooksCollection.delete(id);
            res.status(200).json({ deleted: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // update book by id
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const book = req.body;
            await BooksCollection.update(id, book);
            res.status(200).json({ updated: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

export default booksFunctions;
