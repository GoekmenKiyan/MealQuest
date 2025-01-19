/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui']
      }
  },
  darkMode: "class", // Jetzt kann ich per <div className="dark"> den darkMode aktivieren
  plugins: [],
};