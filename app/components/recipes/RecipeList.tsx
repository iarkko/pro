"use client";

import RecipeCard from "./RecipeCard";
import type { Recipe } from "@/types/recipe";

type Props = {
  recipes: Recipe[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
};

export default function RecipeList({
  recipes,
  openId,
  setOpenId,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => {
        const isOpen = openId === recipe.id;

        return (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isOpen={isOpen}
            onToggle={() =>
              setOpenId(isOpen ? null : recipe.id)
            }
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
    </div>
  );
}