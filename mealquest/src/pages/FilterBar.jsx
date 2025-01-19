// src/components/FilterBar.jsx
import React from "react";

/**
 * 
 * @param {object} dietFilters - { vegetarian: bool, vegan: bool, glutenFree: bool }
 * @param {function} setDietFilters - setter-Funktion
 * @param {string} sortOption - z.B. "calories"
 * @param {function} setSortOption
 * @param {function} onApply - Funktion, die Filter & Sortierung anwenden soll
 */
export default function FilterBar({
  dietFilters,
  setDietFilters,
  sortOption,
  setSortOption,
  onApply,
}) {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="flex gap-4 mb-2">
        {/* Checkbox "Vegetarian" */}
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-1"
            checked={dietFilters.vegetarian}
            onChange={(e) =>
              setDietFilters({ ...dietFilters, vegetarian: e.target.checked })
            }
          />
          Vegetarian
        </label>

        {/* Checkbox "Vegan" */}
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-1"
            checked={dietFilters.vegan}
            onChange={(e) =>
              setDietFilters({ ...dietFilters, vegan: e.target.checked })
            }
          />
          Vegan
        </label>

      </div>

      {/* Sortierung */}
      <div className="mb-2">
        <label className="mr-2">Sort by:</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">-- No Filters --</option>
          <option value="popularity">Popularity</option>
          <option value="healthiness">Healthiness</option>
          <option value="calories">Calories</option>
        </select>
      </div>

      <button
        onClick={onApply}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Filter/Sort anwenden
      </button>
    </div>
  );
}
