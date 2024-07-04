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
    fetchBooks();
    fetchGenres();
    fetchAuthors();
    fetchOrders();
  }, []);

  // Books
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

  // Authors
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

  const addAuthor = async (author) => {
    try {
      await axios.post(`${apiUrl}/authors/add`, author);
      fetchAuthors();
      alert("Author added successfully");
    } catch (error) {
      console.error("Failed to add author", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await axios.delete(`${apiUrl}/authors/delete/${id}`);
      fetchAuthors();
      alert("Author deleted successfully");
    } catch (error) {
      console.error("Failed to delete author", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const updateAuthor = async (id, author) => {
    try {
      await axios.put(`${apiUrl}/authors/update/${id}`, author);
      fetchAuthors();
      alert("Author updated successfully");
    } catch (error) {
      console.error("Failed to update author", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  // Orders
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

  const addOrder = async (order) => {
    try {
      await axios.post(`${apiUrl}/orders/add`, order);
      fetchOrders();
      alert("Order added successfully");
    } catch (error) {
      console.error("Failed to add order", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  }

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${apiUrl}/orders/delete/${id}`);
      fetchOrders();
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Failed to delete order", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <context.Provider
      value={{
        books,
        authors,
        orders,
        genres,
        fetchBooks,
        addBook,
        deleteBook,
        updateBook,
        fetchGenres,
        fetchByGenre,
        fetchAuthors,
        addAuthor,
        deleteAuthor,
        updateAuthor,
        fetchOrders,
        addOrder,
        deleteOrder,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(context);
};
