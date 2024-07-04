// Order.js
import React from "react";
import "../styles/Orders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context";

const Order = ({ item, funcs }) => {
  const { books, date, total } = item;
  const { deleteOrder } = useAppContext();

  const handleDelete = (e) => {
    e.preventDefault();
    deleteOrder(item._id);
  };

  return (
    <div className="order-item">
      <div className="order-header">
        <h2 className="order-title">Order ID: {item._id}</h2>
        <div>
          <button onClick={handleDelete} className="icon-button">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <p className="order-detail">
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      <p className="order-detail">
        <strong>Total:</strong> {total}₪
      </p>
      <div className="order-books">
        <h3>Books:</h3>
        <ul>
          {books.map(({ details, quantity }, index) => (
            <li key={index} className="book-item">
              <div className="book-header">
                <strong className="book-title">
                  {details ? details.title : "Book was deleted"}
                </strong>
              </div>
              <div className="book-detail">
                {details ? (
                  <>
                    <span className="book-author">
                      Author: {details.author.name}
                    </span>
                    <span className="book-price">Price: {details.price}₪</span>
                    <span className="book-quantity">Quantity: {quantity}</span>
                    <span className="book-total">
                      Total: {details.price * quantity}₪
                    </span>
                  </>
                ) : (
                  <span className="book-deleted">Book details are missing</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Order;
