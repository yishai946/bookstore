import React, { useState, useRef } from "react";
import { useAppContext } from "../context";
import List from "../components/List";
import Book from "../components/Book";
import AddBook from "../components/AddBook";

function BooksPage() {
  const initialBookState = {
    title: "",
    year: 0,
    author: "",
    genres: [],
    price: 0,
    pages: 0,
    stock: 0,
  };

  const { books } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [newBook, setNewBook] = useState(initialBookState);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const formRef = useRef(null);

  const openUpdate = (book) => {
    setAddOpen(true);
    setUpdateOpen(true);
    setNewBook(book);

    // Scroll to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancel = () => {
    setAddOpen(false);
    setUpdateOpen(false);
    setNewBook(initialBookState);
  };

  return (
    <div>
      <div className="center-content">
        <button
        ref={formRef}
          className="small-button"
          onClick={addOpen ? cancel : () => setAddOpen(!addOpen)}
        >
          {addOpen || updateOpen ? "Cancel" : "Add Book"}
        </button>
      </div>
      {(addOpen || updateOpen) && (
        <AddBook
          addOpen={addOpen}
          updateOpen={updateOpen}
          newBook={newBook}
          setNewBook={setNewBook}
          cancel={cancel}
        />
      )}
      {books.data && books.data.length > 0 && (
        <List items={books.data} ItemComponent={Book} funcs={[openUpdate]} />
      )}
    </div>
  );
}

export default BooksPage;
