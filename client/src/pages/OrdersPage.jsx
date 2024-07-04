import React, { useState, useEffect } from "react";
import { useAppContext } from "../context";
import List from "../components/List";
import Order from "../components/Order";
import AddOrder from "../components/AddOrder";
import PagesNavBar from "../components/PagesNavBar";
import "../styles/Orders.css"; // Import your CSS file for styling

function OrdersPage() {
  const initialOrderState = {
    books: [],
    date: "",
    total: 0,
  };

  const { orders, fetchOrders, getOrdersBetweenDates } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [newOrder, setNewOrder] = useState(initialOrderState);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchOrders(currentPage, limit);
  }, [currentPage, limit]);

  const openUpdate = (order) => {
    setAddOpen(true);
    setUpdateOpen(true);
    setNewOrder(order);
  };

  const cancel = () => {
    setAddOpen(false);
    setUpdateOpen(false);
    setNewOrder(initialOrderState);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      getOrdersBetweenDates(startDate, endDate, currentPage, limit);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchOrders(currentPage, limit); // Optionally fetch all orders again
  };

  return (
    <div>
      {/* Add order form */}
      <div className="center-content">
        <button
          className="small-button"
          onClick={addOpen ? cancel : () => setAddOpen(!addOpen)}
        >
          {addOpen || updateOpen ? "Cancel" : "Add Order"}
        </button>
      </div>
      {(addOpen || updateOpen) && (
        <AddOrder
          addOpen={addOpen}
          updateOpen={updateOpen}
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          cancel={cancel}
        />
      )}

      {/* Date filter form */}
      <form onSubmit={handleFilterSubmit} className="date-filter-form">
        <div className="date-filter-group">
          <label htmlFor="startDate">From:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="date-input"
          />
        </div>
        <div className="date-filter-group">
          <label htmlFor="endDate">To:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="date-input"
          />
        </div>
        <button type="submit" className="clear-button">
          Filter
        </button>
        <button
          type="button"
          className="clear-button"
          onClick={handleClearFilter}
        >
          Clear
        </button>
      </form>

      {/* List of orders */}
      {orders.data && orders.data.length > 0 && (
        <List items={orders.data} ItemComponent={Order} funcs={[openUpdate]} />
      )}

      {/* Pagination navigation bar */}
      <PagesNavBar
        currentPage={currentPage}
        totalPages={orders.totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Limit selector */}
      <div className="limit-container">
        <label htmlFor="limit" className="limit-label">
          Orders per page:
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

export default OrdersPage;
