import { ObjectId } from "mongodb";
import OrdersCollection from "../db/OrdersCollection.js";
import BooksCollection from "../db/BooksCollection.js";
import AuthorsCollection from "../db/AuthorsCollection.js";

const ordersFunctions = {
  // Get all orders from database
  getAll: async (req, res) => {
    try {
      // Extract page and limit from query parameters
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Get paginated results
      const result = await OrdersCollection.getAll(page, limit);

      // Fetch book details including authors for each order
      await populateBookDetails(result.data);

      // Respond with the paginated data
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get order by id
  get: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      let order = await OrdersCollection.get(id);

      if (order) {
        // Fetch book details including authors for the order
        await populateBookDetails([order]);
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get orders between dates
  getBetweenDates: async (req, res) => {
    try {
      const { from, to, page = 1, limit = 10 } = req.query;

      // Convert page and limit to integers
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;

      // Get paginated results
      const result = await OrdersCollection.getBetweenDates(
        from,
        to,
        pageNum,
        limitNum
      );

      // Fetch book details including authors for each order
      await populateBookDetails(result.data);

      // Respond with the paginated data
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get all-time highest profit day
  getHighestProfitDay: async (req, res) => {
    try {
      const result = await OrdersCollection.getHighestProfitDay();
      res.status(200).json({ day: result._id, profit: result.totalSales });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get total profit between dates
  getTotalProfitBetweenDates: async (req, res) => {
    try {
      const { from, to } = req.query;

      const totalProfit = await OrdersCollection.getTotalProfitBetweenDates(
        from,
        to
      );

      res.status(200).json({ totalProfit });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get most popular book
  getMostPopularBook: async (req, res) => {
    try {
      const result = await OrdersCollection.getMostPopularBook();
      const book = await BooksCollection.get(result.bookId);
      console.log(result)
      res.status(200).json({ book, quantity: result.totalQuantity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get most popular author
  getMostPopularAuthor: async (req, res) => {
    try {
      const result = await OrdersCollection.getMostPopularAuthor();
      const author = await AuthorsCollection.get(result.author);
      res.status(200).json({ author, quantity: result.totalQuantity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get most popular genres
  getMostPopularGenres: async (req, res) => {
    try {
      const from = req.query.from || new Date(0);
      const to = req.query.to || new Date();
      const result = await OrdersCollection.getMostPopularGenres(from, to);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add order to database
  add: async (req, res) => {
    try {
      let order = req.body;

      if (order.books.length === 0)
        throw new Error("Order must contain at least one book");
      if (!order.date) throw new Error("Order must contain a date");

      // convert book ids to ObjectIds
      order.books = order.books.map((book) => {
        return { id: new ObjectId(book.id), quantity: book.quantity };
      });

      // Update stock for each book
      await reduceStock(order.books);

      // Calculate total price
      order.total = await calculatePrice(order.books);

      // Add order to database
      const id = await OrdersCollection.add(order);
      res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete order by id
  delete: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const order = await OrdersCollection.get(id);
      if (!order) throw new Error("Order not found");

      // Update stock for each book (revert stock changes)
      await revertStock(order.books);

      // Delete order from database
      await OrdersCollection.delete(id);
      res.status(200).json({ deleted: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

// Function to populate book details including authors for orders
const populateBookDetails = async (orders) => {
  try {
    const bookIds = orders.flatMap((order) =>
      order.books.map((book) => book.id)
    );
    const uniqueBookIds = [...new Set(bookIds)];

    const books = await BooksCollection.getBooks(uniqueBookIds);

    orders.forEach((order) => {
      order.books.forEach((book) => {
        const detailedBook = books.find(
          (b) => b._id.toString() === book.id.toString()
        );
        if (detailedBook) {
          book.details = detailedBook;
        }
      });
    });
  } catch (error) {
    throw error;
  }
};


// Update stock for books in an order
const reduceStock = async (books) => {
  const updatedBooks = []; // Array to hold books with updated stock

  try {
    // Retrieve current stock for all books in the order
    const booksData = await BooksCollection.getBooks(
      books.map((book) => book.id)
    );

    // Check and update stock for each book
    for (const book of booksData) {
      const orderBook = books.find(
        (orderBook) => orderBook.id.toString() === book._id.toString()
      );
      if (!orderBook)
        throw new Error(`Book with ID ${book._id.toString()} not found`);

      const newStock = book.stock - orderBook.quantity;

      if (newStock < 0) {
        throw new Error(
          `Not enough stock for book with ID ${book._id.toString()}`
        );
      }

      // Update the stock in the book object
      book.stock = newStock;

      // Store the updated book in the array (but don't update in DB yet)
      updatedBooks.push(book);
    }

    // After all checks and updates, update books in the database
    for (const book of updatedBooks) {
      await BooksCollection.update(book._id, { stock: book.stock });
    }
  } catch (error) {
    // Handle errors here, or propagate them back to the caller
    throw error;
  }
};

// Revert stock for books
const revertStock = async (books) => {
  try {
    for (const book of books) {
      const existingBook = await BooksCollection.get(book.id);
      if (existingBook) {
        existingBook.stock += book.quantity;
        await BooksCollection.update(existingBook._id, {
          stock: existingBook.stock,
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

// Calculate total price for an order
const calculatePrice = async (books) => {
  let totalPrice = 0;

  for (const orderBook of books) {
    const book = await BooksCollection.get(orderBook.id);
    if (!book) throw new Error(`Book with ID ${orderBook.id} not found`);

    totalPrice += book.price * orderBook.quantity;
  }

  return totalPrice;
};

export default ordersFunctions;
