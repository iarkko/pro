export type RecipeStep = {
  text: string;
  imageUrl?: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  steps: RecipeStep[];
};