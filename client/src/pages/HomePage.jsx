import React, { useState } from "react";
import { useAppContext } from "../context";
import FilterDates from "../components/FilterDates";
import Author from "../components/Author";
import Book from "../components/Book";
import "../styles/Home.css";

function HomePage() {
  const {
    totalProfit,
    mostPopularBook,
    mostPopularAuthor,
    mostPopularGenres,
    highestProfitDay,
    getTotalProfitBetweenDates,
    getMostPopularGenres,
  } = useAppContext();

  const handleFilterSubmit = (startDate, endDate) => {
    getTotalProfitBetweenDates(startDate, endDate);
    getMostPopularGenres(startDate, endDate);
  };

  const clearFilters = () => {
    getTotalProfitBetweenDates();
    getMostPopularGenres();
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      {/* Filter by Dates */}
      <div className="section">
        <h2>Filter by Dates</h2>
        <FilterDates onFilter={handleFilterSubmit} onClear={clearFilters} />
      </div>

      {/* Total Profit */}
      <div className="section">
        <h2>Total Profit Between Dates</h2>
        <p>{totalProfit}₪</p>
      </div>

      {/* Most Popular Genres */}
      <div className="section">
        <h2>Most Popular Genres Between Dates</h2>
        <ul>
          {mostPopularGenres.length > 0 ? (
            mostPopularGenres.map((genre) => (
              <li key={genre.genre}>
                {genre._id}: {genre.totalQuantity}
              </li>
            ))
          ) : (
            <li>No data available</li>
          )}
        </ul>
      </div>
      
      {/* Most Popular Book */}
      <div className="section">
        <h2>All Time Most Popular Book</h2>

        {mostPopularBook.book ? (
          <Book item={mostPopularBook.book} funcs={[]} options={false} />
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* Most Popular Author */}
      <div className="section">
        <h2>All Time Most Popular Author</h2>
        {mostPopularAuthor.author ? (
          <Author item={mostPopularAuthor.author} funcs={[]} options={false} />
        ) : (
          <p>"No data available"</p>
        )}
      </div>

      {/* Highest Profit Day */}
      <div className="section">
        <h2>All Time Highest Profit Day</h2>
        <p>
          {console.log(highestProfitDay)}
          {highestProfitDay.day
            ? `Date: ${highestProfitDay.day}, Profit: ${highestProfitDay.profit}`
            : "No data available"}
        </p>
      </div>
    </div>
  );
}

export default HomePage;
