import React, { useState } from "react";
import { useAppContext } from "../context";
import List from "../components/List";
import Book from "../components/Book";
import AddBook from "../components/AddBook";

function BooksPage() {
  const { books } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  return (
    <div>
      <div className="center-content">
        <button className="small-button" onClick={() => setAddOpen(!addOpen)}>
          {!addOpen ? "Add Book" : "Close"}
        </button>
      </div>
      {addOpen && <AddBook />}
      {books.data && books.data.length > 0 && <List items={books.data} ItemComponent={Book} />}
    </div>
  );
}

export default BooksPage;
