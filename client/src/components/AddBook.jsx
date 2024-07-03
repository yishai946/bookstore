import React, { useState } from "react";
import { useAppContext } from "../context";

const AddBook = ({ updateOpen, newBook, setNewBook, cancel }) => {
  const { authors, addBook, updateBook } = useAppContext();
  
  const initialBookState = {
    title: "",
    year: 0,
    author: "",
    genres: [],
    price: 0,
    pages: 0,
    stock: 0,
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: parseInt(value),
    });
  };

  // React.useEffect(() => {
  //   console.log(newBook);
  // }, [newBook]);

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

  const handleUpdate = (e) => {
    e.preventDefault();
    let { _id, ...book } = newBook;
    updateBook(book, _id);
    cancel();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook(newBook);
    setNewBook(initialBookState);
    cancel();
  };

  return (
    <form className="add-book-form" onSubmit={!updateOpen ? handleSubmit : handleUpdate}>
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
          value={updateOpen && newBook.author ? newBook.author._id : newBook.author}
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
      <button type="submit">{!updateOpen ? "Add Book" : "Update Book"}</button>
    </form>
  );
};

export default AddBook;
