// src/components/Navbar.jsx
import React from "react";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="p-4 shadow bg-gray-600 text-white flex justify-between">
      {/* Logo/Title */}
      <div className="text-xl font-bold">MealQuest</div>
      {/* Button => toggelt darkMode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-800 px-3 py-1 rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}
