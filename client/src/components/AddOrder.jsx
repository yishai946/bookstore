// AddOrder.js
import React, { useState } from "react";
import "../styles/Orders.css";
import { useAppContext } from "../context";

const AddOrder = () => {
  const { addOrder, books } = useAppContext();
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [date, setDate] = useState("");
  const [total, setTotal] = useState(0);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    const selectedBook = books.data.find((book) => book._id === bookId);
    if (selectedBook) {
      setSelectedBooks([...selectedBooks, { ...selectedBook, quantity: 1 }]);
      setTotal(total + selectedBook.price);
    }
  };

  const handleQuantityChange = (e, bookId) => {
    const quantity = parseInt(e.target.value);
    setSelectedBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId ? { ...book, quantity } : book
      )
    );
    // add or remove the price of the book from the total
    const book = selectedBooks.find((book) => book._id === bookId);
    setTotal(total + (quantity - book.quantity) * book.price);
  };

  const handleRemoveBook = (bookId) => {
    const removedBook = selectedBooks.find((book) => book._id === bookId);
    setSelectedBooks(selectedBooks.filter((book) => book._id !== bookId));
    setTotal(total - removedBook.price * removedBook.quantity);
  };

  const recalculateTotal = () => {
    let newTotal = 0;
    selectedBooks.forEach((book) => {
      newTotal += book.price * book.quantity;
    });
    setTotal(newTotal);
  };
  
const handleSubmit = (e) => {
  // Extract the id and quantity from selectedBooks
  const books = selectedBooks.map(({ _id, quantity }) => ({
    id: _id,
    quantity,
  }));
  e.preventDefault();
  const order = {
    books,
    date,
  };
  addOrder(order);
  setSelectedBooks([]);
  setDate("");
  setTotal(0);
};


  return (
    <div className="add-order-form">
      <h2>Add New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Select Books:</label>
          <select onChange={handleBookChange}>
            <option value="">Select a book...</option>
            {books.data &&
              books.data.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.price}₪
                </option>
              ))}
          </select>
        </div>
        <div className="order-books">
          {selectedBooks.length > 0 && (
            <div className="selected-books">
              <h3>Selected Books:</h3>
              <ul>
                {selectedBooks.map((book) => (
                  <li key={book._id} className="book-item">
                    <div className="book-header">
                      <strong className="book-title">{book.title}</strong>
                    </div>
                    <div className="book-detail">
                      <span className="book-author">
                        Author: {book.author.name}
                      </span>
                      <span className="book-price">Price: {book.price}₪</span>
                      <span className="book-quantity">
                        Quantity:
                        <input
                          type="number"
                          value={book.quantity}
                          onChange={(e) => handleQuantityChange(e, book._id)}
                          min={1}
                          max={book.stock}
                        />
                      </span>
                      <span className="book-total">
                        Total: {book.price * book.quantity}₪
                      </span>
                      <button
                        type="button"
                        className="remove-book"
                        onClick={() => handleRemoveBook(book._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p>Total: {total}₪</p>
            </div>
          )}
        </div>
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
};

export default AddOrder;
