import React from "react";
import "../styles/Books.css"; // Reuse existing styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context";

const Author = ({ item, funcs }) => {
  const { name, country } = item;
  const { deleteAuthor } = useAppContext();
  const openUpdate = funcs[0];

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
      {" "}
      {/* Reusing book-item style for author-item */}
      <div className="book-header">
        {" "}
        {/* Reusing book-header style for author-header */}
        <h2 className="book-title">{name}</h2>{" "}
        {/* Reusing book-title style for author-title */}
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
        {" "}
        {/* Reusing book-detail style for author-detail */}
        <strong>Country:</strong> {country}
      </p>
    </div>
  );
};

export default Author;
