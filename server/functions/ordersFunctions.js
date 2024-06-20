import { ObjectId } from "mongodb";
import OrdersCollection from "../db/OrdersCollection.js";
import BooksCollection from "../db/BooksCollection.js";

const ordersFunctions = {
  // Add order to database
  add: async (req, res) => {
    try {
      const order = req.body;

      // Calculate total price
      order.total = await calculatePrice(order.books);

      // Check if order data is valid
      await checkOrderData(order);

      // Update stock for each book
      await updateStock(order.books, -1);

      // Add order to database
      const id = await OrdersCollection.add(order);
      res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

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

  // Delete order by id
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const order = await OrdersCollection.get(id);
      if (!order) throw new Error("Order not found");

      // Update stock for each book (revert stock changes)
      await updateStock(order.books, 1);

      // Delete order from database
      await OrdersCollection.delete(id);
      res.status(200).json({ deleted: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update order by id
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const newOrder = req.body;

      // Get the existing order
      const oldOrder = await OrdersCollection.get(id);
      if (!oldOrder) throw new Error("Order not found");

      // Revert stock changes of the old order
      await updateStock(oldOrder.books, 1);

      // Calculate total price for the new order
      newOrder.total = await calculatePrice(newOrder.books);

      // Check if the new order data is valid considering reverted stock
      await checkOrderData(newOrder);

      // Apply stock changes of the new order
      await updateStock(newOrder.books, -1);

      // Update the order in the database
      await OrdersCollection.update(id, newOrder);
      res.status(200).json({ updated: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

// Update stock for books in an order
const updateStock = async (books, multiplier) => {
  for (const orderBook of books) {
    const book = await BooksCollection.get(orderBook.id);
    if (!book) throw new Error(`Book with ID ${orderBook.id} not found`);

    const newStock = book.stock + orderBook.quantity * multiplier;
    if (newStock < 0)
      throw new Error(`Not enough stock for book ${book.title}`);

    await BooksCollection.update(book._id, { stock: newStock });
  }
};

// Check if order data is valid
const checkOrderData = async (order) => {
  if (order.total <= 0 || order.books.length === 0 || !order.date) {
    throw new Error("Invalid order data");
  }

  // Check if books exist and are in stock
  const booksIds = order.books.map((book) => book.id);

  // Check if one or more ids are empty
  if (booksIds.includes("")) {
    throw new Error("Book id cannot be empty");
  }

  // Convert ids to ObjectId
  booksIds.forEach((id, index) => {
    booksIds[index] = new ObjectId(id);
  });

  // Try to get all books
  const books = await BooksCollection.getBooks(booksIds);
  if (books.length !== booksIds.length) {
    throw new Error("One or more books do not exist");
  }

  // Check if all books are in stock considering the existing order's impact
  books.forEach((book) => {
    const orderBook = order.books.find((b) => b.id === book._id.toString());
    if (orderBook.quantity > book.stock) {
      throw new Error(`Not enough stock for book ${book.title}`);
    }
  });
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
