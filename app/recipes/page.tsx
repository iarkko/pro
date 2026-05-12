/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import RecipeForm from "@/components/recipes/RecipeForm";
import ImageModal from "@/components/ui/ImageModal";
import type { Recipe, RecipeInput } from "@/types/recipe";

type RecipeUiState = {
  openedMenuRecipeId: string | null;
};

function RecipeCard({
  recipe,
  menuOpen,
  onDelete,
  onEdit,
  onOpen,
  onToggleMenu,
}: {
  recipe: Recipe;
  menuOpen: boolean;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
  onOpen: (id: string) => void;
  onToggleMenu: (id: string) => void;
}) {
  const visibleSteps = recipe.steps ?? [];

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-0.5 hover:border-teal-300/30">
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => onOpen(recipe.id)}
      >
        <div className="relative h-52 overflow-hidden bg-slate-950/70">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No cover image
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5">
            <h2 className="text-xl font-semibold text-white">
              {recipe.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-300">
              {recipe.description || "No description yet."}
            </p>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
        <span className="text-xs text-slate-500">
          {visibleSteps.length} {visibleSteps.length === 1 ? "step" : "steps"}
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu(recipe.id);
            }}
            className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            Actions
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-[var(--shadow)]"
              role="menu"
            >
              <button
                type="button"
                onClick={() => onEdit(recipe)}
                className="w-full px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/5"
                role="menuitem"
              >
                Edit recipe
              </button>
              <button
                type="button"
                onClick={() => onDelete(recipe.id)}
                className="w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                role="menuitem"
              >
                Delete recipe
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function RecipeDetailsDialog({
  recipe,
  onClose,
  onDelete,
  onEdit,
  onImageZoom,
}: {
  recipe: Recipe;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
  onImageZoom: (src: string) => void;
}) {
  const visibleSteps = recipe.steps ?? [];
  const isTwoColumns = visibleSteps.length > 3;
  const [detailsMenuOpen, setDetailsMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-slate-950/90 p-5 sm:p-8">
      <div className="relative mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-[var(--shadow)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 h-3.5 w-3.5 rounded-full bg-red-500 ring-4 ring-red-500/15 transition hover:bg-red-400"
          aria-label="Close recipe"
          title="Close"
        />

        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 pr-16 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:pr-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">
              Recipe details
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {recipe.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {recipe.description || "No description yet."}
            </p>
          </div>

          <div className="relative self-start">
            <button
              type="button"
              onClick={() => setDetailsMenuOpen((prev) => !prev)}
              className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-lg leading-none text-slate-200 transition hover:bg-white/5"
              aria-label="Recipe actions"
              aria-expanded={detailsMenuOpen}
              aria-haspopup="menu"
              title="Recipe actions"
            >
              ⚙
            </button>

            {detailsMenuOpen && (
              <div
                className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-[var(--shadow)]"
                role="menu"
              >
                <button
                  type="button"
                  onClick={() => onEdit(recipe)}
                  className="w-full px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/5"
                  role="menuitem"
                >
                  Edit recipe
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(recipe.id)}
                  className="w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                  role="menuitem"
                >
                  Delete recipe
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              {recipe.imageUrl ? (
                <button
                  type="button"
                  onClick={() => onImageZoom(recipe.imageUrl)}
                  className="block w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="max-h-[64vh] w-full object-cover transition hover:opacity-90"
                  />
                </button>
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-sm text-slate-500">
                  No cover image
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">
                    {visibleSteps.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Steps</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">
                    {
                      visibleSteps.filter((step) => Boolean(step.imageUrl))
                        .length
                    }
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Step images</p>
                </div>
              </div>
            </div>

            <div>
              {visibleSteps.length ? (
                <div
                  className={`grid gap-4 ${
                    isTwoColumns ? "xl:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {visibleSteps.map((step, index) => (
                    <div
                      key={step.id ?? index}
                      className="rounded-lg border border-white/10 bg-slate-900/80 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
                        Step {index + 1}
                      </p>
                      {step.text && (
                        <p className="mt-3 text-sm leading-6 text-slate-100">
                          {step.text}
                        </p>
                      )}
                      {step.imageUrl && (
                        <button
                          type="button"
                          onClick={() => onImageZoom(step.imageUrl!)}
                          className="mt-4 block w-full overflow-hidden rounded-lg"
                        >
                          <img
                            src={step.imageUrl}
                            alt={`Step ${index + 1}`}
                            className="h-44 w-full object-cover transition hover:opacity-90"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-400">
                  No steps yet. Use Edit to add preparation details.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [uiState, setUiState] = useState<RecipeUiState>({
    openedMenuRecipeId: null,
  });

  const selectedRecipe = recipes.find(
    (recipe) => recipe.id === selectedRecipeId
  );

  const recipeCountLabel = useMemo(() => {
    if (recipes.length === 1) return "1 recipe";
    return `${recipes.length} recipes`;
  }, [recipes.length]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") !== "1") {
      return;
    }

    const timer = window.setTimeout(() => {
      setFormOpen(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    void loadRecipes();
  }, []);

  useEffect(() => {
    const isModalOpen =
      formOpen ||
      Boolean(editingRecipe) ||
      Boolean(selectedRecipe) ||
      Boolean(zoom);
    document.body.style.overflow = isModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen, editingRecipe, selectedRecipe, zoom]);

  async function loadRecipes() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recipes", {
        cache: "no-store",
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to load recipes");
      }

      setRecipes(payload as Recipe[]);
    } catch (err) {
      setRecipes([]);
      setError(err instanceof Error ? err.message : "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }

  async function createRecipe(data: RecipeInput) {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.error ?? "Failed to create recipe");
    }

    setRecipes((prev) => [payload as Recipe, ...prev]);
    setFormOpen(false);
    setUiState({
      openedMenuRecipeId: null,
    });
    setSelectedRecipeId((payload as Recipe).id);
  }

  async function updateRecipe(id: string, data: RecipeInput) {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.error ?? "Failed to update recipe");
    }

    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? (payload as Recipe) : recipe))
    );
    setEditingRecipe(null);
    setFormOpen(false);
    setUiState({
      openedMenuRecipeId: null,
    });
    setSelectedRecipeId(id);
  }

  async function deleteRecipe(id: string) {
    const recipe = recipes.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Delete "${recipe?.title ?? "this recipe"}"?`
    );

    if (!confirmed) return;

    const res = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error ?? "Failed to delete recipe");
      return;
    }

    setRecipes((prev) => prev.filter((item) => item.id !== id));
    setUiState((prev) => ({
      openedMenuRecipeId:
        prev.openedMenuRecipeId === id ? null : prev.openedMenuRecipeId,
    }));

    if (selectedRecipeId === id) {
      setSelectedRecipeId(null);
    }

    if (editingRecipe?.id === id) {
      setEditingRecipe(null);
    }
  }

  function openNewRecipeForm() {
    setEditingRecipe(null);
    setSelectedRecipeId(null);
    setFormOpen(true);
    setUiState((prev) => ({ ...prev, openedMenuRecipeId: null }));
  }

  function openEditRecipeForm(recipe: Recipe) {
    setSelectedRecipeId(null);
    setFormOpen(false);
    setEditingRecipe(recipe);
    setUiState((prev) => ({ ...prev, openedMenuRecipeId: null }));
  }

  function closeForm() {
    setFormOpen(false);
    setEditingRecipe(null);
  }

  function openRecipe(id: string) {
    setSelectedRecipeId(id);
    setUiState({ openedMenuRecipeId: null });
  }

  function toggleMenu(id: string) {
    setUiState((prev) => ({
      ...prev,
      openedMenuRecipeId: prev.openedMenuRecipeId === id ? null : id,
    }));
  }

  const activeFormAction = editingRecipe
    ? (data: RecipeInput) => updateRecipe(editingRecipe.id, data)
    : createRecipe;

  const isFormVisible = formOpen || Boolean(editingRecipe);

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">
              Recipe manager
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              Your recipes
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Keep a practical cooking library with cover images, preparation
              steps, step photos, editing and deletion in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadRecipes()}
              className="rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={openNewRecipeForm}
              className="rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-400"
            >
              New recipe
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <p className="text-2xl font-semibold text-white">
              {recipeCountLabel}
            </p>
            <p className="mt-1 text-xs text-slate-500">Saved in the database</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <p className="text-2xl font-semibold text-white">
              {recipes.reduce(
                (total, recipe) => total + (recipe.steps?.length ?? 0),
                0
              )}
            </p>
            <p className="mt-1 text-xs text-slate-500">Preparation steps</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <p className="text-2xl font-semibold text-white">
              {
                recipes.filter(
                  (recipe) =>
                    recipe.imageUrl ||
                    recipe.steps?.some((step) => Boolean(step.imageUrl))
                ).length
              }
            </p>
            <p className="mt-1 text-xs text-slate-500">Recipes with images</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-sm text-slate-400">
          Loading recipes...
        </div>
      ) : recipes.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              menuOpen={uiState.openedMenuRecipeId === recipe.id}
              onDelete={(id) => void deleteRecipe(id)}
              onEdit={openEditRecipeForm}
              onOpen={openRecipe}
              onToggleMenu={toggleMenu}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No recipes yet</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
            Create your first recipe with a title, cover image and preparation
            steps. You can add or remove details later.
          </p>
          <button
            type="button"
            onClick={openNewRecipeForm}
            className="mt-5 rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-400"
          >
            Create first recipe
          </button>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailsDialog
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipeId(null)}
          onDelete={(id) => void deleteRecipe(id)}
          onEdit={openEditRecipeForm}
          onImageZoom={setZoom}
        />
      )}

      {isFormVisible && (
        <div className="no-scrollbar fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 p-5 sm:p-8">
          <div className="relative mx-auto max-w-6xl rounded-lg border border-white/10 bg-slate-950 p-5 shadow-[var(--shadow)] sm:p-6">
            <button
              type="button"
              onClick={closeForm}
              className="absolute right-4 top-4 h-3.5 w-3.5 rounded-full bg-red-500 ring-4 ring-red-500/15 transition hover:bg-red-400"
              aria-label="Close recipe form"
              title="Close"
            />

            <div className="mb-6 pr-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">
                  {editingRecipe ? "Edit recipe" : "New recipe"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {editingRecipe
                    ? `Update ${editingRecipe.title}`
                    : "Add cooking details"}
                </h2>
              </div>
            </div>

            <RecipeForm
              key={editingRecipe?.id ?? "new-recipe"}
              initialData={editingRecipe ?? undefined}
              onSubmitAction={activeFormAction}
              submitLabel={editingRecipe ? "Update recipe" : "Create recipe"}
            />
          </div>
        </div>
      )}

      {zoom && <ImageModal src={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
