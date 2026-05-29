import type { Metadata } from "next";
import { getCurrentUser } from "@/app/lib/auth";
import RecipesClient from "@/components/recipes/RecipesClient";
import type { AuthPermissions } from "@/types/auth";

export const metadata: Metadata = {
  title: "Recipes | Iaroslav Gritsenko",
  description:
    "Книга рецептов с обложками, шагами приготовления и фотографиями.",
};

const publicPermissions: AuthPermissions = {
  read: true,
  create: false,
  delete: false,
};

export default async function RecipesPage() {
  const user = await getCurrentUser();

  return (
    <RecipesClient permissions={user?.permissions ?? publicPermissions} />
  );
}
