// src/pages/RecipeDetail.jsx

import React, { useState } from "react";

export default function RecipeDetail({
  recipe,
  onGoBack,
  loading,
  isInFavorites,
  addToFavorites,
  removeFromFavorites,
}) {
  const [viewMode, setViewMode] = useState("ingredients");

  if (!recipe) return <p>Kein Rezept ausgewählt.</p>;

  // Toggle-Logik: Falls in Favoriten => "Remove from Favorites" (rot), sonst "Add to Favorites" (grün)
  const inFavs = isInFavorites(recipe);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-800 dark:text-white rounded shadow">
      {loading && (
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
          Loading details...
        </p>
      )}

      {/* Header: Titel, Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>

        <div>
          <button
            onClick={onGoBack}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded mr-2 dark:bg-gray-700 dark:text-white"
          >
            Go Back
          </button>
          <button
            onClick={() => {
              if (inFavs) {
                removeFromFavorites(recipe);
              } else {
                addToFavorites(recipe);
              }
            }}
            className={`px-3 py-1 rounded ${
              inFavs
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {inFavs ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>

      {/* 2-spaltiges Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Linke Spalte: Bild */}
        <div className="md:w-1/2">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-auto rounded mb-4"
          />
        </div>

        {/* Rechte Spalte: Buttons + Info */}
        <div className="md:w-1/2">
          {/* Tab-Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setViewMode("ingredients")}
              className={`px-4 py-2 rounded ${
                viewMode === "ingredients"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white"
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setViewMode("instructions")}
              className={`px-4 py-2 rounded ${
                viewMode === "instructions"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white"
              }`}
            >
              Instructions
            </button>
          </div>

          {/* Content je nach Tab */}
          {viewMode === "ingredients" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc pl-5 mb-4">
                {recipe.extendedIngredients?.map((ing) => (
                  <li key={ing.id}>{ing.original}</li>
                ))}
              </ul>
            </div>
          )}

          {viewMode === "instructions" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Instructions</h2>
              {recipe.instructions ? (
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              ) : (
                <p>Keine Anleitung vorhanden.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
