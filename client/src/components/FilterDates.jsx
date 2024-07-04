import React, { useState } from "react";

const FilterDates = ({ onFilter, onClear }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      onFilter(startDate, endDate);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    onClear();
  };

  return (
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
  );
};

export default FilterDates;
