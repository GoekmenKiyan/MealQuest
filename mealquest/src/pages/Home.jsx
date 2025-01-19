// src/pages/Home.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf"; // Für PDF-Export

// Eigene Komponenten
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";

/**
 * Die Hauptseite (Container) der Anwendung:
 * - Enthält den State (Suchbegriff, Rezepte, Filter, Sort, Favoriten, ...)
 * - Kümmert sich um das Laden der Rezepte aus Spoonacular
 * - Lazy Loading bei Scroll
 * - Detailansicht (selectedRecipe)
 * - Eine Favoritenliste mit PDF-Export
 */
export default function Home() {
  // --- 1) Konstanten & State-Variablen ----------------------------------

  // Spoonacular API-Key: In .env -> VITE_SPOONACULAR_API_KEY
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Suchbegriff
  const [searchTerm, setSearchTerm] = useState("");

  // Rezeptliste (das, was wir von Spoonacular kriegen)
  const [recipes, setRecipes] = useState([]);

  // Lazy Loading: offset
  const [offset, setOffset] = useState(0);

  // Loading-Indikator (true, wenn wir axios-Call machen)
  const [loading, setLoading] = useState(false);

  // selectedRecipe: wenn das gesetzt ist, zeigen wir die Detailansicht
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filter- & Sort-States
  const [dietFilters, setDietFilters] = useState({
    vegetarian: false,
    vegan: false,
  });
  const [sortOption, setSortOption] = useState("");

  // Suchhistorie: Array aus Strings, wir persistieren in localStorage
  const [searchHistory, setSearchHistory] = useState([]);

  // Favoritenliste: Array aus Rezept-Objekten
  const [favorites, setFavorites] = useState([]);

  // Ref zum scrollbaren Container (für Lazy Loading)
  const containerRef = useRef(null);

  // --- 2) useEffects ----------------------------------------------------

  /**
   * Beim ersten Rendern laden wir die Suchhistorie aus localStorage
   */
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  /**
   * Immer wenn sich searchHistory ändert, speichern wir sie erneut in localStorage.
   */
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // --- 3) Funktionen zum Laden der Rezepte & Lazy Loading ---------------

  /**
   * Lädt Rezepte von Spoonacular über den /recipes/complexSearch Endpoint.
   * @param {number} newOffset - Ab welchem Index wir laden
   * @param {boolean} append - Wenn true, hängen wir die neuen Rezepte an (Lazy Load)
   */
  const fetchRecipes = async (newOffset = 0, append = false) => {
    if (!searchTerm) return; // Ohne Suchbegriff kein Request
    setLoading(true);
    try {
      // Params-Objekt mit Key, query, number, offset
      const params = {
        apiKey: API_KEY,
        query: searchTerm,
        number: 9, // 9 Rezepte pro "Seite"
        offset: newOffset,
      };

      // Filter -> diät
      const diets = [];
      if (dietFilters.vegetarian) diets.push("vegetarian");
      if (dietFilters.vegan) diets.push("vegan");
      // Falls du glutenFree integrieren willst, hier dazupacken
      if (diets.length > 0) {
        // Komma-getrennt
        params.diet = diets.join(",");
      }

      // Sort
      if (sortOption) {
        params.sort = sortOption; // z. B. "calories"
        params.sortDirection = "desc";
      }

      const response = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        { params }
      );

      // Die zurückgegebenen Rezepte
      const newResults = response.data.results || [];

      if (append) {
        // an bestehende anhängen
        setRecipes((prev) => [...prev, ...newResults]);
      } else {
        // komplett neu setzen
        setRecipes(newResults);
      }
      setOffset(newOffset);
    } catch (error) {
      console.error("Fehler beim Laden der Rezepte:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Wird aufgerufen, wenn der Nutzer in der SearchBar auf "Suchen" klickt oder Enter drückt.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    // Suchhistorie aktualisieren
    setSearchHistory((prev) => [...prev, searchTerm]);

    // Neue Suche -> offset=0
    fetchRecipes(0, false);
  };

  /**
   * Wird aufgerufen, wenn wir in der FilterBar "Filter/Sort anwenden" klicken.
   */
  const applyFilterAndSort = () => {
    fetchRecipes(0, false);
  };

  /**
   * Lazy Loading: Wenn wir am Ende scrollen, offset+=9
   */
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // ca. 200 Pixel vorm Ende
    if (scrollTop + clientHeight >= scrollHeight - 200 && !loading) {
      fetchRecipes(offset + 9, true);
    }
  };

  /**
   * Registriere/Unregister Scroll-Event bei Mount/Unmount
   */
  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    div.addEventListener("scroll", handleScroll);
    return () => {
      div.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, offset, loading]);

  // --- 4) Detailansicht & Favoriten-Logik --------------------------------

  /**
   * Rezeptdetails laden (via /recipes/{id}/information)
   */
  const showRecipeDetails = async (recipeId) => {
    setLoading(true);
    try {
      const detailRes = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: { apiKey: API_KEY },
        }
      );
      // Speichern -> Detailansicht aktiv
      setSelectedRecipe(detailRes.data);
    } catch (error) {
      console.error("Fehler beim Laden der Rezeptdetails:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Go Back -> zurück zur Liste
   */
  const goBackToList = () => {
    setSelectedRecipe(null);
  };

  /**
   * Rezept zu den Favoriten hinzufügen (wenn noch nicht vorhanden).
   * recipe: das komplette Rezeptobjekt
   */
  const addToFavorites = (recipe) => {
    if (!recipe) return;
    // Schon in favorites?
    if (favorites.some((fav) => fav.id === recipe.id)) return;
    setFavorites((prev) => [...prev, recipe]);
  };

  /**
   * Exportiert die Favoritenliste als PDF
   * mithilfe von jsPDF
   */
  const exportFavoritesAsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("My Favorite Recipes", 10, 10);

    let yOffset = 20;
    // Einfacher Text-Export: Nur Titel auflisten
    favorites.forEach((fav) => {
      doc.setFontSize(12);
      doc.text(`- ${fav.title}`, 10, yOffset);
      yOffset += 8;
    });

    doc.save("favorites.pdf");
  };

  // --- 5) UI-Rendering ---------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Zeige nur die Liste/Filter, wenn KEIN Rezept ausgewählt ist */}
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
              <div className="flex gap-2 flex-wrap">
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

          {/* Favoritenliste */}
          {favorites.length > 0 && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold mb-2">My Favorites</h3>
              <ul className="list-disc pl-5 mb-2">
                {favorites.map((fav) => (
                  <li key={fav.id}>{fav.title}</li>
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

          {/* Ergebnisliste (scrollbarer Container) */}
          <div
            ref={containerRef}
            className="bg-white rounded shadow p-2 border h-[60vh] overflow-y-auto"
          >
            <RecipeList
              recipes={recipes}
              onRecipeClick={showRecipeDetails}
            />

            {loading && (
              <div className="text-center my-4">
                <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-500 border-t-transparent"></span>
                <p>Laden ...</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detailansicht */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onGoBack={goBackToList}
          loading={loading}
          onAddToFavorites={addToFavorites}
        />
      )}
    </div>
  );
}

