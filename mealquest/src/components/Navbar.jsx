import React from "react";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="p-4 shadow bg-gray-600 text-white flex justify-between">
      <div className="text-xl font-bold">MealQuest</div>
      {/* Button, um Dark Mode zu toggeln */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-800 px-3 py-1 rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}
