import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "http://localhost:3001/api";

const context = createContext();

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
    fetchAuthors();
    fetchOrders();
  }, []);

  const fetchBooks = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiUrl}/books/getAll?page=${page}&limit=${limit}`
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${apiUrl}/books/getGenres`);
      setGenres(response.data);
    } catch (error) {
      console.error("Failed to fetch genres", error);
    }
  };

  const fetchByGenre = async (genre, page, limit) => {
    try {
      const response = await axios.get(
        `${apiUrl}/books/getByGenre/${genre}?page=${page}&limit=${limit}`
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books by genre", error);
    }
  };

  const fetchAuthors = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiUrl}/authors/getAll?page=${page}&limit=${limit}`
      );
      setAuthors(response.data);
    } catch (error) {
      console.error("Failed to fetch authors", error);
    }
  };

  const fetchOrders = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders/getAll?page=${page}&limit=${limit}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const addBook = async (book) => {
    try {
      await axios.post(`${apiUrl}/books/add`, book);
      fetchBooks();
      alert("Book added successfully");
    } catch (error) {
      console.error("Failed to add book", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${apiUrl}/books/delete/${id}`);
      fetchBooks();
      alert("Book deleted successfully");
    } catch (error) {
      console.error("Failed to delete book", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const updateBook = async (book, id) => {
    try {
      await axios.put(`${apiUrl}/books/update/${id}`, book);
      fetchBooks();
      alert("Book updated successfully");
    } catch (error) {
      console.error("Failed to update book", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <context.Provider
      value={{
        books,
        orders,
        authors,
        addBook,
        deleteBook,
        updateBook,
        fetchBooks,
        fetchAuthors,
        fetchOrders,
        genres,
        fetchByGenre,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(context);
};
