import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  // darkMode = false/true => toggeln wir in Navbar
  const [darkMode, setDarkMode] = useState(false);

  return (
    // Oberste <div> kriegt die Klasse "dark" wenn darkMode = true
    <div className={darkMode ? "dark" : ""}>
      {/* "min-h-screen" => volle Höhe 
          "dark:bg-gray-700" => Hintergrund im Darkmode 
          "dark:text-gray" => Schriftfarbe im Darkmode */}
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-700 dark:text-gray">
        {/* Navbar fix oben */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Hauptbereich => Home */}
        <main className="flex-grow">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default App;
