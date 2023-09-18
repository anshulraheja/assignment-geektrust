import React from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBar({ value, onChange }) {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
      <div className="search-icon">
        <FiSearch />
      </div>
    </div>
  );
}

export default SearchBar;
