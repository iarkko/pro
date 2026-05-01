"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/types/recipe";

type Props = {
  recipe: Recipe;
  isOpen: boolean;
  setOpen: () => void;
  onDeleteAction: (id: string) => Promise<void>;
  onEditAction: (recipe: Recipe) => void;
};

export default function RecipeCard({
  recipe,
  isOpen,
  setOpen,
  onDeleteAction,
  onEditAction,
}: Props) {
  const [confirm, setConfirm] = useState(false);

  return (
    <motion.div
      layout
      onClick={setOpen}
      className="
        rounded-2xl overflow-hidden
        border border-white/10
        bg-zinc-950/60
        cursor-pointer
      "
    >
      {/* IMAGE */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          className="w-full h-44 object-cover"
        />
      )}

      <div className="p-3">
        <h3 className="text-white">{recipe.title}</h3>
        <p className="text-white/40 text-sm">
          {recipe.description}
        </p>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              <div className="text-white/70 text-sm space-y-1">
                {recipe.steps?.length ? (
                  recipe.steps.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))
                ) : (
                  <div className="text-white/30">
                    No steps
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAction(recipe);
                  }}
                  className="text-blue-400"
                >
                  Edit
                </button>

                {!confirm ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirm(true);
                    }}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await onDeleteAction(recipe.id);
                      }}
                      className="text-red-400"
                    >
                      Yes
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirm(false);
                      }}
                      className="text-white/40"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}