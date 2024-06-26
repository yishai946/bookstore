import React from "react";
import "../styles/App.css";

const PagesNavBar = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="pagesNavBar">
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`page-item ${number === currentPage ? "active" : ""}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default PagesNavBar;
