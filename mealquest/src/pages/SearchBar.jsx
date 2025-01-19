// src/components/SearchBar.jsx
import React from "react";

/**
 * 
 * @param {string} searchTerm - aktueller Suchbegriff
 * @param {function} setSearchTerm - State-Setter für Suchbegriff
 * @param {function} onSearch - Handler, wenn Nutzer Enter drückt / Button klickt
 */
export default function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <form onSubmit={onSearch} className="flex mb-4 bg-white rounded shadow p-4">
      <input
        type="text"
        placeholder="Search recipes..."
        className="flex-1 border border-gray-300 rounded-l px-3 py-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="submit"
        className="bg-gray-800 text-white px-4 py-2 rounded-r"
      >
        Suchen
      </button>
    </form>
  );
}
