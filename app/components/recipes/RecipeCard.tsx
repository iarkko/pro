"use client";

import type { Recipe } from "@/types/recipe";

type Props = {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
};

export default function RecipeCard({
  recipe,
  isOpen,
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div
      onClick={onToggle}
      className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition hover:scale-[1.01]"
    >
      {/* PREVIEW MODE */}
      {!isOpen && (
        <div className="space-y-2">
          {recipe.imageUrl && (
            <div className="h-40 w-full overflow-hidden">
              <img
                src={recipe.imageUrl}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-3 space-y-1">
            <h2 className="text-white font-semibold">
              {recipe.title}
            </h2>

            {recipe.description && (
              <p className="text-white/60 text-sm line-clamp-2">
                {recipe.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* EXPANDED MODE */}
      {isOpen && (
        <div className="p-4 space-y-3">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-white font-semibold">
              {recipe.title}
            </h2>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe);
                }}
                className="text-xs bg-blue-600 px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe.id);
                }}
                className="text-xs bg-red-600 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>

          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {recipe.description && (
            <p className="text-white/60 text-sm">
              {recipe.description}
            </p>
          )}

          {/* STEPS RENDER */}
          <div className="pt-2 space-y-2">
            <h3 className="text-white/50 text-sm">Steps</h3>

            {recipe.steps?.length ? (
              recipe.steps.map((s) => (
                <div key={s.id} className="space-y-2">
                  <div className="text-white/80 text-sm">
                    • {s.text}
                  </div>

                  {s.image && (
                    <div className="h-28 overflow-hidden rounded-md">
                      <img
                        src={s.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-white/30 text-sm">
                No steps
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}