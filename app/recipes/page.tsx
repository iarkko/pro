"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  id: string;
  text: string;
  imageUrl?: string;
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  steps: Step[];
};

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

/* =========================
   CARD
========================= */
function RecipeCard({
  r,
  onEdit,
  onDelete,
}: {
  r: Recipe;
  onEdit: (r: Recipe) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="p-3 bg-white/5 rounded-xl space-y-2 hover:bg-white/10 transition text-sm">

      {/* HEADER */}
      <div
        onClick={() => setExpanded((v) => !v)}
        className="cursor-pointer space-y-2"
      >
        {r.imageUrl && (
          <img
            src={r.imageUrl}
            className="rounded-lg max-h-40 w-full object-cover"
          />
        )}

        <div>
          <h3 className="font-bold">{r.title}</h3>
          <p className="text-xs text-white/60">{r.description}</p>
        </div>
      </div>

      {/* EXPANDED */}
      <div
        className={`transition-all duration-300 ${
          expanded ? "max-h-[1000px]" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="mt-3 space-y-3">

          {r.steps.map((s) => (
            <div key={s.id} className="bg-white/5 rounded p-2 space-y-2">
              <div className="text-xs text-white/80">{s.text}</div>

              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  className="rounded max-h-[80px] w-full object-cover"
                />
              )}
            </div>
          ))}

          {/* MENU */}
          <div className="flex justify-end relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="text-white/40 hover:text-white text-lg px-2"
            >
              ⚙️
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-6 bg-black/80 border border-white/10 rounded p-2 z-20 w-32">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(r);
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-white/10"
                >
                  Edit
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    if (!confirm("Delete recipe?")) return;
                    await onDelete(r.id);
                  }}
                  className="block w-full text-left px-2 py-1 text-red-400 hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    steps: Step[];
  }>({
    title: "",
    description: "",
    imageUrl: "",
    steps: [{ id: uid(), text: "", imageUrl: undefined }],
  });

  async function load() {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    setRecipes(data);
  }

  useEffect(() => {
    load();
  }, []);

  /* =========================
     MAIN IMAGE HANDLER
  ========================= */
  function handleMainImage(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      steps: [{ id: uid(), text: "", imageUrl: undefined }],
    });
    setOpenForm(true);
  }

  function openEdit(r: Recipe) {
    setEditingId(r.id);
    setForm({
      title: r.title,
      description: r.description,
      imageUrl: r.imageUrl,
      steps: r.steps.map((s) => ({
        id: uid(),
        text: s.text,
        imageUrl: s.imageUrl,
      })),
    });
    setOpenForm(true);
  }

  function addStep() {
    setForm((p) => ({
      ...p,
      steps: [...p.steps, { id: uid(), text: "", imageUrl: undefined }],
    }));
  }

  function updateStep(id: string, value: string) {
    setForm((p) => ({
      ...p,
      steps: p.steps.map((s) =>
        s.id === id ? { ...s, text: value } : s
      ),
    }));
  }

  function removeStep(id: string) {
    setForm((p) => ({
      ...p,
      steps: p.steps.filter((s) => s.id !== id),
    }));
  }

  async function save() {
    const payload = {
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      steps: form.steps.map((s) => ({
        text: s.text,
        imageUrl: s.imageUrl ?? null,
      })),
    };

    await fetch(
      editingId ? `/api/recipes/${editingId}` : "/api/recipes",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setOpenForm(false);
    setEditingId(null);
    load();
  }

  async function deleteRecipe(id: string) {
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipes</h1>

        <button
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          + Add
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            r={r}
            onEdit={openEdit}
            onDelete={deleteRecipe}
          />
        ))}
      </div>

      {/* FORM */}
      {openForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-3xl bg-[#0B1020] rounded-2xl p-6 space-y-6">

            <h2 className="text-xl font-bold">
              {editingId ? "Edit recipe" : "New recipe"}
            </h2>

            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full p-2 bg-black/40 rounded"
              placeholder="Title"
            />

            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 bg-black/40 rounded"
              placeholder="Description"
            />

            {/* =========================
                MAIN IMAGE DRAG & DROP
            ========================= */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleMainImage(e.dataTransfer.files?.[0] || null);
              }}
              className="w-full h-48 rounded-xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleMainImage(e.target.files?.[0] || null)
                }
              />

              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white/40">
                  Drop / Click main image
                </span>
              )}
            </div>

            {/* STEPS */}
            <div className="space-y-3">
              {form.steps.map((step) => (
                <div
                  key={step.id}
                  className="grid grid-cols-[1fr_140px] gap-3 relative"
                >

                  {/* 🔴 DELETE DOT */}
                  <div
                    onClick={() => removeStep(step.id)}
                    className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full cursor-pointer hover:scale-125 transition"
                  />

                  <textarea
                    value={step.text}
                    onChange={(e) =>
                      updateStep(step.id, e.target.value)
                    }
                    className="p-2 bg-black/40 rounded pr-6"
                  />

                  <label className="border border-dashed border-white/20 rounded flex items-center justify-center">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm((p) => ({
                            ...p,
                            steps: p.steps.map((s) =>
                              s.id === step.id
                                ? { ...s, imageUrl: reader.result as string }
                                : s
                            ),
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {step.imageUrl ? (
                      <img
                        src={step.imageUrl}
                        className="h-full object-cover"
                      />
                    ) : (
                      "image"
                    )}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={addStep}>+ step</button>

              <div className="flex gap-2">
                <button onClick={() => setOpenForm(false)}>
                  Cancel
                </button>

                <button
                  onClick={save}
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}