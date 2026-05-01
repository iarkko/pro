export type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  steps: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
};