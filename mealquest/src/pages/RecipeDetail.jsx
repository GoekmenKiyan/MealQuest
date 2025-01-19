// src/components/RecipeDetail.jsx
import React from "react";

/**
 * Zeigt das ausgewählte Rezept im Detail an (im gleichen "Screen").
 * @param {object} recipe - Rezeptobjekt (title, image, summary, extendedIngredients, ...)
 * @param {function} onGoBack - Callback, um zur Liste zurückzukehren
 */
export default function RecipeDetail({ recipe, onGoBack, loading }) {
  if (!recipe) {
    return <p>Kein Rezept ausgewählt.</p>;
  }

  return (
    <div className="bg-white rounded shadow p-4">
      {loading && <p>Wird geladen...</p>}
      <button
        onClick={onGoBack}
        className="mb-4 px-3 py-1 bg-gray-600 text-white rounded"
      >
        Go Back
      </button>
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="mb-4 w-full h-auto rounded"
      />
      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: recipe.summary }}
      />
      <h3 className="text-lg font-semibold mb-2">Zutaten</h3>
      <ul className="list-disc pl-5 mb-4">
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>
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
