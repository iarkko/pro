export type RecipeStep = {
  id: string;
  text: string;
  image?: string | null;
};

export type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  steps: RecipeStep[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
};