import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context";
import List from "../components/List";
import Book from "../components/Book";
import AddBook from "../components/AddBook";
import PagesNavBar from "../components/PagesNavBar";
import GenreFilter from "../components/GenreFilter";

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

  const { books, fetchBooks, fetchByGenre, genres } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [newBook, setNewBook] = useState(initialBookState);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    if (selectedGenre) {
      fetchByGenre(selectedGenre, currentPage, limit);
    } else {
      fetchBooks(currentPage, limit);
    }
  }, [currentPage, limit, selectedGenre]);

  const formRef = useRef(null);

  const openUpdate = (book) => {
    setAddOpen(true);
    setUpdateOpen(true);
    setNewBook(book);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancel = () => {
    setAddOpen(false);
    setUpdateOpen(false);
    setNewBook(initialBookState);
  };

  const handlePickGenre = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1);
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
      <GenreFilter
        selectedGenre={selectedGenre}
        onGenreChange={handlePickGenre}
        genres={genres}
      />
      {books.data && books.data.length > 0 && (
        <List items={books.data} ItemComponent={Book} funcs={[openUpdate]} />
      )}
      <PagesNavBar
        currentPage={currentPage}
        totalPages={books.totalPages}
        onPageChange={setCurrentPage}
      />
      <div className="limit-container">
        <label htmlFor="limit" className="limit-label">
          Books per page:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          className="limit-select"
        >
          {[5, 10, 15, 20].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default BooksPage;
