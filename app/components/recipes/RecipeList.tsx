"use client";

import RecipeCard from "./RecipeCard";
import type { Recipe } from "@/types/recipe";

type Props = {
  recipes: Recipe[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onEdit: (recipe: Recipe) => void;
};

export default function RecipeList({
  recipes,
  openId,
  setOpenId,
  onEdit,
}: Props) {
  return (
    <div className="grid gap-4">
      {recipes.map((recipe) => {
        const isOpen = openId === recipe.id;

        return (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isOpen={isOpen}
            setOpen={() =>
              setOpenId(isOpen ? null : recipe.id)
            }
            onEdit={onEdit}
          />
        );
      })}
    </div>
  );
}