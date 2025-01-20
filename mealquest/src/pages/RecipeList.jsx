import React from "react";
import LazyImage from "../components/LazyImage"; // Intersection Observer

export default function RecipeList({ recipes, onRecipeClick }) {
  return (
    // Grid => 1 Spalte mobil, 2 Spalten (sm), 3 Spalten (md)
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        // Klick => onRecipeClick => zeigt Detail
        <div
          key={recipe.id}
          onClick={() => onRecipeClick(recipe.id)}
          className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
        >
          {/* LazyImage => nur laden, wenn im Viewport */}
          <LazyImage
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48"
          />
          <div className="p-3">
            <h2 className="font-semibold text-center">{recipe.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
