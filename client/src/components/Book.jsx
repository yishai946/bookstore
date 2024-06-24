import React from "react";
import "../styles/Books.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context";

const Book = ({ item, funcs }) => {
  const { title, year, author, genres, price, pages, stock } = item;
  const { deleteBook } = useAppContext();
  const openUpdate = funcs[0];

  const handleDelete = (e) => {
    e.preventDefault();
    deleteBook(item._id);
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    openUpdate(item);
  }

  return (
    <div className="book-item">
      <div className="book-header">
        <h2 className="book-title">{title}</h2>
        <div>
          <button onClick={handleDelete} className="icon-button">
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button onClick={handleUpdate} className="icon-button">
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </div>

      <p className="book-detail">
        <strong>Author:</strong> {author.name}
      </p>
      <p className="book-detail">
        <strong>Year:</strong> {year}
      </p>
      <p className="book-detail">
        <strong>Genres:</strong> {genres.join(", ")}
      </p>
      <p className="book-detail">
        <strong>Price:</strong> {price}₪
      </p>
      <p className="book-detail">
        <strong>Pages:</strong> {pages}
      </p>
      <p className="book-detail">
        <strong>Stock:</strong> {stock}
      </p>
    </div>
  );
};

export default Book;
