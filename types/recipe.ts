export type RecipeStep = {
  id?: string;
  text: string;
  imageUrl?: string | null;
  stepOrder?: number;
};

export type RecipeInput = {
  title: string;
  description?: string;
  imageUrl?: string;
  steps: RecipeStep[];
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  steps: RecipeStep[];
  createdAt?: string;
  updatedAt?: string;
};
