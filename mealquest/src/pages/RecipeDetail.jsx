// src/pages/RecipeDetail.jsx

import React from "react";

/**
 * Zeigt das ausgewählte Rezept im Detail an.
 * @param {object} recipe - Rezeptobjekt (title, image, summary, extendedIngredients, ...)
 * @param {function} onGoBack - Callback, um zur Liste zurückzukehren
 * @param {function} onAddToFavorites - Callback, um das Rezept in die Favoritenliste aufzunehmen
 * @param {boolean} loading - zeigt an, ob Daten noch laden
 */
export default function RecipeDetail({
  recipe,
  onGoBack,
  onAddToFavorites,
  loading,
}) {
  if (!recipe) {
    return <p>Kein Rezept ausgewählt.</p>;
  }

  return (
    <div className="bg-white rounded shadow p-4">
      {/* Ladeindikator */}
      {loading && <p>Wird geladen...</p>}

      {/* Go Back -> zurück zur Liste */}
      <button
        onClick={onGoBack}
        className="mb-4 px-3 py-1 bg-gray-600 text-white rounded"
      >
        Go Back
      </button>

      {/* Add to Favorites */}
      <button
        onClick={() => onAddToFavorites(recipe)}
        className="mb-4 ml-2 px-3 py-1 bg-green-500 text-white rounded"
      >
        Add to Favorites
      </button>

      {/* Rezepttitel */}
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>

      {/* Rezeptbild */}
      <img
        src={recipe.image}
        alt={recipe.title}
        className="mb-4 w-full h-auto rounded"
      />

      {/* Zusammenfassung (HTML) */}
      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: recipe.summary }}
      />

      {/* Zutatenliste */}
      <h3 className="text-lg font-semibold mb-2">Zutaten</h3>
      <ul className="list-disc pl-5 mb-4">
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>

      {/* Nährwerte (falls vorhanden) */}
      {recipe.nutrition && (
        <>
          <h3 className="text-lg font-semibold mb-2">Nährwerte</h3>
          <ul className="list-disc pl-5">
            {recipe.nutrition.nutrients.map((nutrient) => (
              <li key={nutrient.name}>
                {nutrient.name}: {nutrient.amount}
                {nutrient.unit}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
