// src/components/RecipeList.jsx
import React from "react";

/**
 * Zeigt alle Rezepte in einem Grid an.
 * @param {Array} recipes - Array mit Rezeptobjekten
 * @param {function} onRecipeClick - Funktion, die aufgerufen wird,
 *                                   wenn Nutzer ein Rezept anklickt
 */
export default function RecipeList({ recipes, onRecipeClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          onClick={() => onRecipeClick(recipe.id)}
          className="relative bg-gray-100 rounded overflow-hidden cursor-pointer"
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-2">
            {recipe.title}
          </div>
        </div>
      ))}
    </div>
  );
}
