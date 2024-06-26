import React from "react";
import "../styles/Books.css";
import { useAppContext } from "../context";

const AddAuthor = ({
  addOpen,
  updateOpen,
  newAuthor,
  setNewAuthor,
  cancel,
}) => {
  const { addAuthor, updateAuthor } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAuthor((prevAuthor) => ({
      ...prevAuthor,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateOpen) {
      // separate id from newAuthor object
      const { _id, ...author } = newAuthor;
      updateAuthor(_id, author);
    } else {
      addAuthor(newAuthor);
    }
    cancel();
  };

  return (
    <div className="add-book-form">
      {" "}
      {/* Reusing add-book-form for add-author-form */}
      <h2>{updateOpen ? "Update Author" : "Add Author"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newAuthor.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={newAuthor.country}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{updateOpen ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default AddAuthor;
