import React from "react";
import "../styles/Books.css"; // Reuse existing styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context";

const Author = ({ item, funcs, options=true }) => {
  const { name, country } = item;
  const { deleteAuthor } = useAppContext();
  const openUpdate = options && funcs[0];

  const handleDelete = (e) => {
    e.preventDefault();
    deleteAuthor(item._id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    openUpdate(item);
  };

  return (
    <div className="book-item">
      <div className="book-header">
        <h2 className="book-title">{name}</h2>
        {options && <div>
          <button onClick={handleDelete} className="icon-button">
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button onClick={handleUpdate} className="icon-button">
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>}
      </div>
      <p className="book-detail">
        <strong>Country:</strong> {country}
      </p>
    </div>
  );
};

export default Author;
