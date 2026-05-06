"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import type { RecipeInput } from "@/types/recipe";

export default function EditRecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<RecipeInput | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/recipes/${id}`)
      .then((r) => r.json())
      .then((data) => setRecipe(data || null))
      .catch(() => setRecipe(null));
  }, [id]);

  async function updateRecipe(data: RecipeInput) {
    if (!id) return;

    await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  if (!recipe) {
    return <div className="text-white/50">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <RecipeForm
        key={String(id)}
        onSubmitAction={updateRecipe}
        initialData={recipe}
      />
    </div>
  );
}
