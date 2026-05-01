"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecipes, updateRecipe } from "@/lib/api/recipes";

import StepEditor from "@/app/components/recipes/StepEditor";
import type { Recipe, RecipeStep } from "@/types/recipe";

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getRecipes();
      const found = data.find((r: Recipe) => r.id === id);
      setRecipe(found ?? null);
    };

    load();
  }, [id]);

  const save = async (steps: RecipeStep[]) => {
    if (!recipe) return;

    const updated = {
      ...recipe,
      steps,
    };

    setRecipe(updated);
    await updateRecipe(recipe.id, updated);
  };

  if (!recipe) {
    return (
      <div className="p-10 text-white/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">

      {/* BACK */}
      <button
        onClick={() => router.push("/cookbook")}
        className="text-sm text-white/50 hover:text-white mb-6"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-4">
        {recipe.title}
      </h1>

      {/* IMAGE */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          className="max-h-[300px] rounded-lg object-cover mb-6"
        />
      )}

      {/* DESCRIPTION */}
      {recipe.description && (
        <p className="text-white/60 mb-6">
          {recipe.description}
        </p>
      )}

      {/* STEPS (FIXED) */}
      <StepEditor
        value={(recipe.steps as unknown as RecipeStep[]) || []}
        onChange={save}
      />

    </div>
  );
}