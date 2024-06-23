import React from "react";
import "../styles/Books.css";

const Book = ({ item }) => {
  const { title, year, author, genres, price, pages, stock } = item;

  return (
    <div className="book-item">
      <h2 className="book-title">{title}</h2>
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
