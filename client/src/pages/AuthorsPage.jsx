import React, { useState, useEffect } from "react";
import { useAppContext } from "../context";
import Author from "../components/Author";
import List from "../components/List";
import AddAuthor from "../components/AddAuthor";
import PagesNavBar from "../components/PagesNavBar";

function AuthorsPage() {
  const initialAuthorState = {
    name: "",
    country: "",
  };

  const { authors, fetchAuthors } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState(initialAuthorState);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchAuthors(currentPage, limit);
  }, [currentPage, limit]);

  const openUpdate = (author) => {
    setAddOpen(true);
    setUpdateOpen(true);
    setNewAuthor(author);
  };

  const cancel = () => {
    setAddOpen(false);
    setUpdateOpen(false);
    setNewAuthor(initialAuthorState);
  };

  return (
    <div>
      <div className="center-content">
        <button
          className="small-button"
          onClick={addOpen ? cancel : () => setAddOpen(!addOpen)}
        >
          {addOpen || updateOpen ? "Cancel" : "Add Author"}
        </button>
      </div>
      {(addOpen || updateOpen) && (
        <AddAuthor
          addOpen={addOpen}
          updateOpen={updateOpen}
          newAuthor={newAuthor}
          setNewAuthor={setNewAuthor}
          cancel={cancel}
        />
      )}
      {authors.data && authors.data.length > 0 && (
        <List
          items={authors.data}
          ItemComponent={Author}
          funcs={[openUpdate]}
        />
      )}
      <PagesNavBar
        currentPage={currentPage}
        totalPages={authors.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AuthorsPage;
