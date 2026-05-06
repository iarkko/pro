export type RecipeStep = {
  id?: string;
  text: string;
  imageUrl?: string;
};

export type RecipeInput = {
  title: string;
  description: string;
  imageUrl?: string;
  steps: RecipeStep[];
};

export type Recipe = RecipeInput & {
  id: string;
};