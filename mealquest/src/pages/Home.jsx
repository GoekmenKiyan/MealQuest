import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail"

export default function Home() {
  // Spoonacular-API-Key aus .env
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // State-Variablen
  const [darkMode, setDarkMode] = useState(false);

  // 1) Suchbegriff & Ergebnis-States
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);


  // 2) Filter und Sortierung
  const [dietFilters, setDietFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });
  const [sortOption, setSortOption] = useState("");

  // 3) Suchhistorie
  const [searchHistory, setSearchHistory] = useState([]);

  // Lazy-Loading
  const containerRef = useRef(null);

  // Funktionen
  // 1) Hauptfunktion, um Rezepte zu laden
  const fetchRecipes = async (newOffset = 0, append = false) => {
    if (!searchTerm) return;
    setLoading(true);

    try {
      // Params für Filter & Sort
      const params = {
        apiKey: API_KEY,
        query: searchTerm,
        number: 9,
        offset: newOffset,
      };

      // Diet-Filter
      const diets = [];
      if (dietFilters.vegetarian) diets.push("vegetarian");
      if (dietFilters.vegan) diets.push("vegan");
      if (diets.length > 0) {
        params.diet = diets.join(",");
      }

      // Sort
      if (sortOption) {
        params.sort = sortOption; // z.B. "calories" 
        params.sortDirection = "desc";
      }

      const response = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        { params }
      );
      const newResults = response.data.results || [];

      if (append) {
        setRecipes((prev) => [...prev, ...newResults]);
      } else {
        setRecipes(newResults);
      }
      setOffset(newOffset);
    } catch (err) {
      console.error("Fehler beim Laden der Rezepte:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2) Suche starten (wird von SearchBar aufgerufen)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    // Suchhistorie
    setSearchHistory((prev) => [...prev, searchTerm]);

    // Offset zurücksetzen, neu laden
    fetchRecipes(0, false);
  };

  // 3) Filter/Sort anwenden (wird von FilterBar aufgerufen)
  const applyFilterAndSort = () => {
    setOffset(0);
    fetchRecipes(0, false);
  };

  // 4) Lazy Loading beim Scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 200 && !loading) {
      // Nächste Seite
      fetchRecipes(offset + 9, true);
    }
  };

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll, containerRef, offset, loading]);

  // 5) Detail laden
  const showRecipeDetails = async (recipeId) => {
    setLoading(true);
    try {
      const detailRes = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: {
            apiKey: API_KEY,
          },
        }
      );
      setSelectedRecipe(detailRes.data);
    } catch (error) {
      console.error("Fehler beim Laden der Rezeptdetails:", error);
    } finally {
      setLoading(false);
    }
  };

  // 6) Zurück zur Liste / goBackToList
  const goBackToList = () => {
    setSelectedRecipe(null);
  };

  // -----------------------
  // UI-Rendering
  // -----------------------
  return (
    <div className="max-w-7xl mx-auto p-4">
      {!selectedRecipe && (
        <>
          {/* SearchBar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
          />

          {/* FilterBar */}
          <FilterBar
            dietFilters={dietFilters}
            setDietFilters={setDietFilters}
            sortOption={sortOption}
            setSortOption={setSortOption}
            onApply={applyFilterAndSort}
          />

          {/* Suchhistorie */}
          {searchHistory.length > 0 && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold mb-2">Suchhistorie</h3>
              <div className="flex gap-2">
                {searchHistory.map((term, idx) => (
                  <button
                    key={term + idx}
                    className="bg-gray-200 px-2 py-1 rounded"
                    onClick={() => {
                      setSearchTerm(term);
                      fetchRecipes(0, false);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ergebnisliste in scrollbarem Container */}
          <div
            ref={containerRef}
            className="bg-white rounded shadow p-2 border h-[60vh] overflow-y-auto"
          >
            <RecipeList
              recipes={recipes}
              onRecipeClick={showRecipeDetails}
            />

            {/* Ladeindikator */}
            {loading && (
              <div className="text-center my-4">
                <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-500 border-t-transparent"></span>
                <p>Laden ...</p>
              </div>
            )}
          </div>
        </>
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onGoBack={goBackToList}
          loading={loading}
        />
      )}
    </div>
  );
}
