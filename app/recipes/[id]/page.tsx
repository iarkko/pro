"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ImageModal from "@/components/ui/ImageModal";
import type { Recipe, RecipeStep } from "@/types/recipe";

export default function RecipeViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/recipes/${id}`)
      .then((r) => r.json())
      .then((data) => setRecipe(data || null))
      .catch(() => setRecipe(null));
  }, [id]);

  async function handleDelete() {
    if (!id) return;

    await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });

    router.push("/recipes");
  }

  function handleEdit() {
    if (!id) return;
    router.push(`/recipes/${id}/edit`);
  }

  if (!recipe) {
    return <div className="text-white/50">Loading...</div>;
  }

  const stepsCount = recipe.steps?.length || 0;
  const isTwoColumns = stepsCount > 3;

  return (
    <>
      <motion.div
        className="max-w-4xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[var(--shadow)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Recipe details
              </p>
              <h1 className="text-3xl font-semibold text-white">
                {recipe.title}
              </h1>
            </div>

            <p className="text-slate-300">{recipe.description}</p>

            {recipe.notionUrl ? (
              <a
                href={recipe.notionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-900"
              >
                <span>🗒</span>
                Open Notion page
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-500">
                <span>🗒</span>
                No notion link
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              <span>⚙</span>
              Actions
            </button>

            {menuOpen && (
              <motion.div
                className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-[var(--shadow)]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/5"
                >
                  Edit recipe
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  Delete recipe
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {recipe.imageUrl && (
          <motion.img
            src={recipe.imageUrl}
            alt={recipe.title || "Recipe image"}
            className="w-full rounded-3xl object-cover border border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setZoom(recipe.imageUrl!)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        )}

        <div className={`grid gap-4 ${isTwoColumns ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {(recipe.steps ?? []).map((step: RecipeStep, index: number) => (
            <motion.div
              key={step.id ?? index}
              className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Step {index + 1}
                </span>
              </div>
              <p className="mt-3 text-slate-100">{step.text}</p>
              {step.imageUrl && (
                <img
                  src={step.imageUrl}
                  alt={`Step ${index + 1}`}
                  className="mt-4 w-full rounded-3xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setZoom(step.imageUrl!)}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {zoom && <ImageModal src={zoom} onClose={() => setZoom(null)} />}
    </>
  );
}
