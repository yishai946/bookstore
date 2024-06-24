import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "http://localhost:3001/api";

// Create a new context
const context = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchOrders();
  }, []);

  //   fetch books with pagination
  const fetchBooks = async (page = 1, limit = 10) => {
    axios
      .get(`${apiUrl}/books/getAll?page=${page}&limit=${limit}`)
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   fetch authors with pagination
  const fetchAuthors = async (page = 1, limit = 10) => {
    axios
      .get(`${apiUrl}/authors/getAll?page=${page}&limit=${limit}`)
      .then((response) => {
        setAuthors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   fetch orders with pagination
  const fetchOrders = async (page = 1, limit = 10) => {
    axios
      .get(`${apiUrl}/orders/getAll?page=${page}&limit=${limit}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addBook = async (book) => {
    try {
      await axios.post(`${apiUrl}/books/add`, book);
      fetchBooks();
      alert("Book added successfully");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error in adding book: ${error.response.data.error}`);
      } else {
        alert(`Error in adding book: ${error.message}`);
      }
      console.log(error);
    }
  };

  // delete a book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`${apiUrl}/books/delete/${id}`);
      fetchBooks();
      alert("Book deleted successfully");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error in deleting book: ${error.response.data.error}`);
      } else {
        alert(`Error in deleting book: ${error.message}`);
      }
      console.log(error);
    }
  };

  // update a book
  const updateBook = async (book, id) => {
    try {
      await axios.put(`${apiUrl}/books/update/${id}`, book);
      fetchBooks();
      alert("Book updated successfully");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error in updating book: ${error.response.data.error}`);
      } else {
        alert(`Error in updating book: ${error.message}`);
      }
      console.log(error);
    }
  };

  return (
    <context.Provider
      value={{ books, orders, authors, addBook, deleteBook, updateBook }}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(context);
};
