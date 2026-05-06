"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import RecipeForm from "@/components/recipes/RecipeForm";
import ImageModal from "@/components/ui/ImageModal";
import type { Recipe, RecipeInput } from "@/types/recipe";

type ApiRecipe = Recipe;

function RecipeCard({
  recipe,
  onDelete,
  onEdit,
  onImageZoom,
}: {
  recipe: ApiRecipe;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onImageZoom: (src: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const stepsCount = recipe.steps?.length || 0;
  const isTwoColumns = stepsCount > 3;

  return (
    <motion.article
      layout
      className="rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-indigo-400/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={() => !expanded && !menuOpen && setExpanded(true)}
    >
      <motion.div layout className="relative overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title || "Recipe image"}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-slate-950/80 text-slate-500">
            No cover image
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-5 py-4">
          <h3 className="text-xl font-semibold text-white">{recipe.title}</h3>
          <p className="mt-1 text-sm text-slate-300 line-clamp-2">
            {recipe.description || "No description yet."}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 px-5 py-5 relative"
            onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking inside
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
            {recipe.steps && recipe.steps.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Steps</h4>
                <div className={`grid gap-4 ${isTwoColumns ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {recipe.steps.map((step, index) => (
                    <motion.div
                      key={step.id ?? index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                      className="rounded-3xl border border-white/10 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Step {index + 1}
                        </span>
                      </div>
                      <p className="text-slate-100 text-sm mb-3">{step.text}</p>
                      {step.imageUrl && (
                        <img
                          src={step.imageUrl}
                          alt={`Step ${index + 1}`}
                          className="w-full h-32 rounded-3xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onImageZoom(step.imageUrl!)}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
                >
                  <span>⚙</span>
                  Actions
                </button>

                {menuOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-3 w-44 z-50 rounded-3xl border border-white/10 bg-slate-950/95 shadow-[var(--shadow)]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(recipe.id);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/5"
                    >
                      Edit recipe
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(recipe.id);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete recipe
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<ApiRecipe[]>([]);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then(setRecipes)
      .catch(() => setRecipes([]));
  }, []);

  async function createRecipe(data: RecipeInput) {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const recipe = await res.json();
    setRecipes((prev) => [recipe, ...prev]);
    setOpen(false);
  }

  async function deleteRecipe(id: string) {
    await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Recipe manager
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Your recipes
          </h1>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
        >
          + New recipe
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={(id) => router.push(`/recipes/${id}/edit`)}
            onDelete={deleteRecipe}
            onImageZoom={setZoom}
          />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-40 overflow-auto bg-black/80 p-6 sm:p-10">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Create recipe
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  New recipe details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <RecipeForm onSubmitAction={createRecipe} />
          </div>
        </div>
      )}

      {zoom && <ImageModal src={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
