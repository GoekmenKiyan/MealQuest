// src/pages/SearchBar.jsx
import React from "react";
import { FaSearch } from "react-icons/fa"; // Optional, falls du ein Icon-Paket nutzt

/**
 * 
 * @param {string} searchTerm 
 * @param {function} setSearchTerm 
 * @param {function} onSearch 
 */
export default function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <form
      onSubmit={onSearch}
      className="relative flex items-center"
      style={{ width: "400px" }} // Feste Breite, damit die Leiste kleiner ist
    >
      {/* Such-Icon links */}
      <span className="absolute left-3 text-gray-500">
        <FaSearch />
      </span>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-3 py-2 w-full rounded-l-full rounded-r-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="absolute right-2 text-gray-500"
      >
        {/* Falls du ein extra Icon oder Text nutzen willst */}
      </button>
    </form>
  );
}
