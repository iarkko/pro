"use client";

import { useState } from "react";
import ImageModal from "@/components/ui/ImageModal";

export default function RecipePreview({
  recipe,
  onClose,
}: any) {
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
              onClick={() => setModal(recipe.imageUrl)}
              className="w-full rounded-lg cursor-pointer"
            />
          )}

          {/* STEPS */}
          <div className="space-y-3">
            {recipe.steps?.map((s: any, i: number) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg">

                <p className="mb-2">{s.text}</p>

                {/* 3x narrower image */}
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    onClick={() => setModal(s.imageUrl)}
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