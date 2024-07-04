import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "http://localhost:3001/api";

const context = createContext();

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [genres, setGenres] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [mostPopularBook, setMostPopularBook] = useState({});
  const [mostPopularAuthor, setMostPopularAuthor] = useState({});
  const [mostPopularGenres, setMostPopularGenres] = useState([]);
  const [highestProfitDay, setHighestProfitDay] = useState({});

  useEffect(() => {
    fetchBooks();
    fetchGenres();
    fetchAuthors();
    fetchOrders();
    getMostPopularBook();
    getMostPopularAuthor();
    getMostPopularGenres();
    getHighestProfitDay();
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
      getMostPopularAuthor();
      getMostPopularBook();
      getMostPopularGenres();
      getHighestProfitDay();
      getTotalProfitBetweenDates();
      alert("Order added successfully");
    } catch (error) {
      console.error("Failed to add order", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

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

  const getOrdersBetweenDates = async (from, to, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders/getBetweenDates?from=${from}&to=${to}&page=${page}&limit=${limit}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders between dates", error);
    }
  };

  // Home
  const getTotalProfitBetweenDates = async (from, to) => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders/profitBetweenDates?from=${from}&to=${to}`
      );
      setTotalProfit(response.data.totalProfit);
    } catch (error) {
      console.error("Failed to fetch total profit between dates", error);
    }
  };

  const getMostPopularBook = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders/mostPopularBook`);
      setMostPopularBook(response.data);
    } catch (error) {
      console.error("Failed to fetch most popular book", error);
    }
  };

  const getMostPopularAuthor = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders/mostPopularAuthor`);
      setMostPopularAuthor(response.data);
    } catch (error) {
      console.error("Failed to fetch most popular author", error);
    }
  }

  const getMostPopularGenres = async (from, to) => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders/mostPopularGenres?from=${from}&to=${to}`
      );
      console.log(response)
      setMostPopularGenres(response.data);
    } catch (error) {
      console.error("Failed to fetch most popular genres", error);
    }
  }

  const getHighestProfitDay = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders/highestProfitDay`);
      setHighestProfitDay(response.data);
    } catch (error) {
      console.error("Failed to fetch highest profit day", error);
    }
  }
  

  return (
    <context.Provider
      value={{
        books,
        authors,
        orders,
        genres,
        totalProfit,
        mostPopularBook,
        mostPopularAuthor,
        mostPopularGenres,
        highestProfitDay,
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
        getOrdersBetweenDates,
        getTotalProfitBetweenDates,
        getMostPopularGenres,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(context);
};
