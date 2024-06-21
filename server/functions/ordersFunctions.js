import { ObjectId } from "mongodb";
import OrdersCollection from "../db/OrdersCollection.js";
import BooksCollection from "../db/BooksCollection.js";

const ordersFunctions = {
  // Get all orders from database
  getAll: async (req, res) => {
    try {
      const orders = await OrdersCollection.getAll();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get order by id
  get: async (req, res) => {
    try {
      const id = req.params.id;
      const order = await OrdersCollection.get(id);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add order to database
  add: async (req, res) => {
    try {
      const order = req.body;

      // Check if order data is valid
      await checkOrderData(order);

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
      const id = req.params.id;
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

// Update stock for books in an order
const reduceStock = async (books) => {
    const updatedBooks = []; // Array to hold books with updated stock

    try {
        // Retrieve current stock for all books in the order
        const booksData = await BooksCollection.getBooks(books.map((book) => book.id));

        // Check and update stock for each book
        for (const book of booksData) {
            const orderBook = books.find((orderBook) => orderBook.id === book._id.toString());
            if (!orderBook) throw new Error(`Book with ID ${book._id} not found`);

            const newStock = book.stock - orderBook.quantity;

            if (newStock < 0) {
                throw new Error(`Not enough stock for book with ID ${book._id}`);
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
                await BooksCollection.update(existingBook._id, { stock: existingBook.stock });
            }
        }
    } catch (error) {
        throw error;
    }
};

// Check if order data is valid
const checkOrderData = async (order) => {
  if (order.books.length === 0 || !order.date) {
    throw new Error("Invalid order data");
  }

  // Check if books exist and are in stock
  const booksIds = order.books.map((book) => book.id);

  // Check if one or more ids are empty
  if (booksIds.includes("")) {
    throw new Error("Book id cannot be empty");
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
