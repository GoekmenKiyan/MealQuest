// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

// Eigene Komponenten:
import SearchBar from "./SearchBar";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";

export default function Home() {
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Such & Rezept-State
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);

  // Für Paginierung oder was du bereits hast
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Detail
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filter
  const [dietVegetarian, setDietVegetarian] = useState(false);
  const [dietVegan, setDietVegan] = useState(false);
  const [sortOption, setSortOption] = useState("");

  // Suchhistorie
  const [searchHistory, setSearchHistory] = useState([]);

  // **Favoriten**: Array von Rezept-Objekten
  const [favorites, setFavorites] = useState([]);

  // Beim Mount: Suchhistorie aus localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Bei Änderungen: Speichern
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // ============= Rezepte abrufen (mit offset, if needed) =============
  const fetchRecipes = async (newOffset = 0, append = false) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const params = {
        apiKey: API_KEY,
        query: searchTerm,
        number: 6,
        offset: newOffset,
      };
      // Filter
      const diets = [];
      if (dietVegetarian) diets.push("vegetarian");
      if (dietVegan) diets.push("vegan");
      if (diets.length > 0) {
        params.diet = diets.join(",");
      }
      // Sort
      if (sortOption) {
        params.sort = sortOption;
        params.sortDirection = "desc";
      }

      const resp = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        { params }
      );
      const newResults = resp.data.results || [];

      // Falls append -> anfügen, sonst neu setzen
      if (append) {
        setRecipes((prev) => [...prev, ...newResults]);
      } else {
        setRecipes(newResults);
      }
      // Einfache Logik: wenn <6 zurückkommen -> hasMore=false
      if (newResults.length < 6) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setOffset(newOffset);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============= Suche, Filter, etc. =============
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setSearchHistory((prev) => [...prev, searchTerm]);
    fetchRecipes(0, false);
  };

  const applyFiltersAndSort = () => {
    fetchRecipes(0, false);
  };

  // "Load More" (falls du es so handhabst)
  const loadMore = () => {
    fetchRecipes(offset + 6, true);
  };

  // ============= Detailanzeige =============
  const showRecipeDetails = async (id) => {
    setLoading(true);
    try {
      const det = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        { params: { apiKey: API_KEY } }
      );
      setSelectedRecipe(det.data);
    } catch (err) {
      console.error("Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBackToList = () => {
    setSelectedRecipe(null);
  };

  // ============= Favoriten-Logik =============
  // Rezept in Favorites?
  const isInFavorites = (recipe) => {
    return favorites.some((fav) => fav.id === recipe.id);
  };

  // Add
  const addToFavorites = (recipe) => {
    if (!recipe) return;
    if (!isInFavorites(recipe)) {
      setFavorites([...favorites, recipe]);
    }
  };

  // Remove
  const removeFromFavorites = (recipe) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== recipe.id));
  };

  // PDF-Export
  const exportFavoritesAsPDF = () => {
    const doc = new jsPDF();
    doc.text("My Favorite Recipes", 10, 10);
    let yPos = 20;
    favorites.forEach((fav) => {
      doc.text(`- ${fav.title}`, 10, yPos);
      yPos += 10;
    });
    doc.save("favorites.pdf");
  };

  // ============= Render =============
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Wenn KEIN Rezept selektiert, zeig Start-Ansicht */}
      {!selectedRecipe && (
        <>
          {/* HEAD: SearchBar */}
          <div className="flex flex-col items-center justify-center mb-8">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
            />
            {/* Zwei runde Buttons (Vegetarian, Vegan) */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setDietVegetarian(!dietVegetarian)}
                className={`rounded-full px-4 py-2 font-semibold 
                ${
                  dietVegetarian
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Vegetarian
              </button>
              <button
                onClick={() => setDietVegan(!dietVegan)}
                className={`rounded-full px-4 py-2 font-semibold 
                ${
                  dietVegan
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Vegan
              </button>
            </div>

            {/* Sort + Apply */}
            <div className="flex items-center gap-4 mt-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">-- No Sort --</option>
                <option value="popularity">Popularity</option>
                <option value="healthiness">Healthiness</option>
                <option value="calories">Calories</option>
              </select>
              <button
                onClick={applyFiltersAndSort}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Filter/Sort anwenden
              </button>
            </div>
          </div>

          {/* Suchhistorie */}
          {searchHistory.length > 0 && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold mb-2">Suchhistorie</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, idx) => (
                  <button
                    key={term + idx}
                    onClick={() => {
                      setSearchTerm(term);
                      fetchRecipes(0, false);
                    }}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Favoritenliste: rotes X zum Entfernen */}
          {favorites.length > 0 && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold mb-2">My Favorites</h3>
              <ul className="list-disc pl-5 mb-4">
                {favorites.map((fav) => (
                  <li key={fav.id} className="flex items-center justify-between">
                    <span>{fav.title}</span>
                    <button
                      onClick={() => removeFromFavorites(fav)}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={exportFavoritesAsPDF}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Export as PDF
              </button>
            </div>
          )}

          {/* Rezeptliste */}
          <RecipeList recipes={recipes} onRecipeClick={showRecipeDetails} />

          {loading && (
            <div className="text-center my-4">
              <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-500 border-t-transparent"></span>
              <p>Laden ...</p>
            </div>
          )}

          {/* Optional Load More */}
          {!loading && recipes.length > 0 && hasMore && (
            <div className="flex justify-center my-4">
              <button
                onClick={() => fetchRecipes(offset + 6, true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* Detailansicht */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          loading={loading}
          // Geben wir Props für Favorites weiter:
          isInFavorites={(r) => isInFavorites(r)}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          onGoBack={goBackToList}
        />
      )}
    </div>
  );
}

