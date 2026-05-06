"use client";

import RecipeForm from "@/components/recipes/RecipeForm";
import type { RecipeInput } from "@/types/recipe";

export default function NewRecipePage() {

  async function createRecipe(data: RecipeInput) {
    try {
      console.log("CREATE REQUEST:", data);

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("SERVER RESPONSE:", result);

    } catch (e) {
      console.error("CREATE FAILED:", e);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <RecipeForm onSubmitAction={createRecipe} />
    </div>
  );
}
