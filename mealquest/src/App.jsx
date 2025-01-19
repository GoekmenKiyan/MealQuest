// src/App.jsx
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    // Wenn darkMode=true, wird die Klasse auf "dark" gestezt auf oberster Ebene
    <div className={darkMode ? "dark" : ""}>
      {/* dunkler Hintergrund & helle Schrift im Darkmode */}
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-700 dark:text-gray">
        {/* Navbar */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-grow">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default App;
