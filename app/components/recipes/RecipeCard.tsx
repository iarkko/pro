"use client";

import { useState } from "react";
import type { Recipe } from "@/types/recipe";

type Props = {
  recipe: Recipe;
  isOpen: boolean;
  setOpen: () => void;
  onEdit: (recipe: Recipe) => void;
};

export default function RecipeCard({
  recipe,
  isOpen,
  setOpen,
  onEdit,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={setOpen}
      className="
        origin-top
        scale-[0.78]
        hover:scale-[0.80]
        transition-transform
        duration-200

        rounded-xl
        border border-white/10
        bg-zinc-950/60
        hover:bg-zinc-950

        cursor-pointer
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-base font-medium">
          {recipe.title}
        </h3>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((s) => !s);
            }}
            className="text-white/40 hover:text-white"
          >
            ⚙
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-lg text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-white/5"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* IMAGE */}
      {recipe.imageUrl && (
        <div className="px-4">
          <img
            src={recipe.imageUrl}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="px-4 py-3 text-sm text-white/70">
        {recipe.description}
      </div>

      {/* STEPS */}
      {isOpen && (
        <div className="px-4 pb-4 grid gap-3">
          {recipe.steps?.map((step, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-lg p-3 bg-zinc-900/40"
            >
              <div className="text-sm">{step.text}</div>

              {step.imageUrl && (
                <img
                  src={step.imageUrl}
                  className="mt-2 w-full h-32 object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}