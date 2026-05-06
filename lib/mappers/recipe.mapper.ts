import type { Recipe, RecipeStep } from "@/types/recipe";

type DbRecipeStep = RecipeStep & {
  stepOrder: number;
};

type DbRecipe = Omit<Recipe, "steps"> & {
  steps?: DbRecipeStep[];
};

export function toClientRecipe(recipe: DbRecipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.imageUrl ?? "",
    steps: (recipe.steps || [])
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map((s) => ({
        id: s.id,
        text: s.text,
        imageUrl: s.imageUrl ?? "",
      })),
  };
}
