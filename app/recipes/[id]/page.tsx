"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Recipe, RecipeStep } from "@/types/recipe";

export default function RecipeViewPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/recipes/${id}`)
      .then((r) => r.json())
      .then((data) => setRecipe(data || null))
      .catch(() => setRecipe(null));
  }, [id]);

  if (!recipe) {
    return (
      <div className="text-white/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">
        {recipe?.title || "No title"}
      </h1>

      {recipe?.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title || "Recipe image"}
          className="w-full rounded-xl object-cover"
        />
      )}

      <p className="text-white/70">
        {recipe?.description || ""}
      </p>

      <div className="space-y-3">
        {(recipe?.steps ?? []).map((s: RecipeStep, i: number) => (
          <div key={s.id ?? i} className="bg-white/5 p-3 rounded-lg">
            {s?.text || ""}
          </div>
        ))}
      </div>

    </div>
  );
}
