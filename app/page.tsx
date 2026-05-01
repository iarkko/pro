"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getRecipes,
  updateRecipe,
  deleteRecipe,
} from "@/lib/api/recipes";

import RecipeList from "@/app/components/recipes/RecipeList";
import CreateRecipeForm from "@/app/components/recipes/CreateRecipeForm";
import type { Recipe } from "@/types/recipe";

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [openId, setOpenId] = useState<string | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data ?? []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreate = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
  };

  const handleDelete = async (id: string) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));

    if (openId === id) setOpenId(null);
  };

  const handleUpdate = async (id: string, data: Partial<Recipe>) => {
    const updated = await updateRecipe(id, data);

    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q)
    );
  }, [recipes, query]);

  return (
    <div className="min-h-screen text-white">

      {/* HEADER */}
      <div className="pt-24 px-6 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-semibold">
            Рецепты
          </h1>
          <p className="text-white/40 text-sm">
            {filtered.length} items
          </p>
        </div>

        <div className="flex items-center gap-4">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-[280px] px-4 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-white text-sm"
          />

          <button
            onClick={() => {
              setEditingRecipe(null);
              setIsFormOpen(true);
            }}
            className="bg-violet-600 px-4 py-2 rounded-xl"
          >
            + Add
          </button>

        </div>
      </div>

      {/* LIST */}
      <div className="px-6 mt-8">
        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : (
          <RecipeList
            recipes={filtered}
            openId={openId}
            setOpenId={setOpenId}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-5 relative">

            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingRecipe(null);
              }}
              className="absolute top-3 right-3 text-white/40"
            >
              ✕
            </button>

            <CreateRecipeForm
              mode={editingRecipe ? "edit" : "create"}
              initialData={editingRecipe}
              onCreated={(r) => {
                handleCreate(r);
                setIsFormOpen(false);
              }}
              onUpdated={(id, data) => {
                handleUpdate(id, data);
                setIsFormOpen(false);
                setEditingRecipe(null);
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}