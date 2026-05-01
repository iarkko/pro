import type { Recipe } from "@/types/recipe";

export async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes");
  return res.json();
}

export async function createRecipe(data: Omit<Recipe, "id">): Promise<Recipe> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateRecipe(
  id: string,
  data: Partial<Recipe>
): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  await fetch(`/api/recipes/${id}`, {
    method: "DELETE",
  });
}