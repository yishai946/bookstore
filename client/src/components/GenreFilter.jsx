// src/components/GenreFilter.js
import React from "react";
import "../styles/Books.css";

const GenreFilter = ({ selectedGenre, onGenreChange, genres }) => {
  return (
    <div className="genre-filter">
      <h4>Filter by Genre</h4>
      <select
        value={selectedGenre || ""}
        onChange={(e) => onGenreChange(e.target.value)}
        className="genre-select"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
