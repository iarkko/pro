export function toClientRecipe(recipe: any) {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.imageUrl ?? "",
    steps: (recipe.steps || [])
      .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
      .map((s: any) => ({
        id: s.id,
        text: s.text,
        imageUrl: s.imageUrl ?? "",
      })),
  };
}