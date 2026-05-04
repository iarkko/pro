import type { Recipe } from "@/types/recipe";

// GET
export async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await res.json();

  return data.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? "",
    imageUrl: recipe.imageUrl ?? "",
    steps: recipe.steps ?? [],
  }));
}

// CREATE
export async function createRecipe(data: {
  title: string;
  description: string;
  imageUrl: string;
  steps: string[];
}): Promise<Recipe> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create recipe");
  }

  const recipe = await res.json();

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? "",
    imageUrl: recipe.imageUrl ?? "",
    steps: recipe.steps ?? [],
  };
}

// DELETE
export async function deleteRecipe(id: string): Promise<void> {
  const res = await fetch(`/api/recipes?id=${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete recipe");
  }
}