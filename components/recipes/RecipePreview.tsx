"use client";

import { useState } from "react";
import ImageModal from "@/components/ui/ImageModal";
import type { Recipe, RecipeStep } from "@/types/recipe";

export default function RecipePreview({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <div className="fixed inset-0 bg-black/90 p-6 overflow-auto z-40">
        <div className="max-w-2xl mx-auto space-y-4">

          <button onClick={onClose} className="text-white/60">
            Close
          </button>

          <h1 className="text-xl font-semibold">
            {recipe.title}
          </h1>

          <p className="text-white/60">
            {recipe.description}
          </p>

          {/* MAIN IMAGE */}
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              onClick={() => {
                if (recipe.imageUrl) setModal(recipe.imageUrl);
              }}
              alt={recipe.title || "Recipe image"}
              className="w-full rounded-lg cursor-pointer"
            />
          )}

          {/* STEPS */}
          <div className="space-y-3">
            {recipe.steps?.map((s: RecipeStep, i: number) => (
              <div key={s.id ?? i} className="p-3 bg-white/5 rounded-lg">

                <p className="mb-2">{s.text}</p>

                {/* 3x narrower image */}
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    onClick={() => {
                      if (s.imageUrl) setModal(s.imageUrl);
                    }}
                    alt={`Step ${i + 1} image`}
                    className="w-1/3 rounded cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {modal && (
        <ImageModal src={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}
