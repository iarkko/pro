"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import ImageModal from "@/components/ui/ImageModal";
import type { Recipe, RecipeInput } from "@/types/recipe";

type ApiRecipe = Recipe;

function RecipeCard({
  recipe,
  onDelete,
  onView,
}: {
  recipe: ApiRecipe;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) {
  const hasNotion = Boolean(recipe.notionUrl?.trim());

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-indigo-400/20">
      <div className="relative">
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
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span>🗒</span>
            Notion
          </span>
          {hasNotion ? (
            <a
              href={recipe.notionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-100 hover:text-white"
            >
              Open link
            </a>
          ) : (
            <span className="text-slate-500">Notion not set</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => onView(recipe.id)}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onDelete(recipe.id)}
            className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
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
            onView={(id) => router.push(`/recipes/${id}`)}
            onDelete={deleteRecipe}
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
