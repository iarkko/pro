export type RecipeStep = {
  id?: string;
  text: string;
  imageUrl?: string | null;
  stepOrder?: number;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  steps: RecipeStep[];
};

export type RecipeInput = {
  title: string;
  description?: string;
  imageUrl?: string | null;
  steps?: RecipeStep[];
};
