import React, { useState } from "react";
import { useAppContext } from "../context";

const AddBook = () => {
  const { authors, addBook } = useAppContext();
  const initialBookState = {
    title: "",
    year: 0,
    author: "",
    genres: [],
    price: 0,
    pages: 0,
    stock: 0,
  };

  const [newBook, setNewBook] = useState(initialBookState);

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewBook({
      ...newBook,
      [name]: parseInt(value),
    });
  };

  const handleChangeString = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value,
    });
  }

  const handleGenreChange = (e) => {
    const { value } = e.target;
    setNewBook({
      ...newBook,
      genres: value.split(",").map((genre) => genre.trim()),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook(newBook);
    setNewBook(initialBookState);
  };

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h2>Add New Book</h2>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={newBook.title}
          onChange={handleChangeString}
          required
        />
      </div>
      <div className="form-group">
        <label>Year:</label>
        <input
          type="number"
          name="year"
          value={newBook.year}
          onChange={handleChangeNumber}
          required
        />
      </div>
      <div className="form-group">
        <label>Author:</label>
        <select
          name="author"
          value={newBook.author}
          onChange={handleChangeString}
          required
        >
          <option value="">Select an author</option>
          {authors.data.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Genres (comma-separated):</label>
        <input
          type="text"
          name="genres"
          value={newBook.genres.join(", ")}
          onChange={handleGenreChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={newBook.price}
          onChange={handleChangeNumber}
          required
        />
      </div>
      <div className="form-group">
        <label>Pages:</label>
        <input
          type="number"
          name="pages"
          value={newBook.pages}
          onChange={handleChangeNumber}
          required
        />
      </div>
      <div className="form-group">
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={newBook.stock}
          onChange={handleChangeNumber}
          required
        />
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBook;
