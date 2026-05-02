"use client";

import { useEffect, useState } from "react";

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
  steps: string[];
};

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    steps: Step[];
  }>({
    title: "",
    description: "",
    imageUrl: "",
    steps: [{ id: uid(), text: "" }],
  });

  async function load() {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/recipes");
      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(file: File, type: "main" | "step", stepId?: string) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (type === "main") {
      setForm((p) => ({ ...p, imageUrl: data.url }));
    }

    if (type === "step" && stepId) {
      setForm((p) => ({
        ...p,
        steps: p.steps.map((s) =>
          s.id === stepId ? { ...s, imageUrl: data.url } : s
        ),
      }));
    }
  }

  async function save() {
    const payload = {
      ...form,
      steps: form.steps.map((s) => s.text),
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

    setForm({
      title: "",
      description: "",
      imageUrl: "",
      steps: [{ id: uid(), text: "" }],
    });

    load();
  }

  function addStep() {
    setForm((p) => ({
      ...p,
      steps: [...p.steps, { id: uid(), text: "" }],
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

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipes</h1>

        <button
          onClick={() => setOpenForm(true)}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          + Add
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400">Failed to load recipes</div>}

      {!loading && !error && (
        <div className="grid grid-cols-3 gap-6">
          {recipes.map((r) => (
            <div key={r.id} className="p-4 bg-white/5 rounded-xl space-y-2">
              {r.imageUrl && (
                <img src={r.imageUrl} className="rounded-lg" />
              )}
              <h3 className="font-bold">{r.title}</h3>
              <p className="text-sm text-white/60">{r.description}</p>
            </div>
          ))}
        </div>
      )}

      {openForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl bg-[#0B1020] rounded-2xl p-6 space-y-6">

            <h2 className="text-xl font-bold">
              {editingId ? "Edit recipe" : "New recipe"}
            </h2>

            <input
              className="w-full p-2 bg-black/40 rounded"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              className="w-full p-2 bg-black/40 rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label className="block border border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file, "main");
                }}
              />

              {form.imageUrl ? (
                <img src={form.imageUrl} className="max-h-40 mx-auto" />
              ) : (
                <p className="text-white/40">
                  Drag & drop or click image
                </p>
              )}
            </label>

            {/* STEPS */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium">Steps</p>
                <button onClick={addStep}>+ step</button>
              </div>

              {form.steps.map((step) => (
                <div
                  key={step.id}
                  className="grid grid-cols-[1fr_140px] gap-3 items-start p-3 bg-black/30 rounded-lg"
                >
                  {/* TEXT */}
                  <textarea
                    className="w-full min-h-[80px] p-2 bg-black/40 rounded resize-none"
                    value={step.text}
                    onChange={(e) =>
                      updateStep(step.id, e.target.value)
                    }
                    placeholder="Step description..."
                  />

                  {/* IMAGE BLOCK */}
                  <div className="relative h-[80px]">
                    <label className="h-full w-full border border-dashed border-white/20 rounded flex items-center justify-center text-xs text-white/50 cursor-pointer overflow-hidden">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, "step", step.id);
                        }}
                      />

                      {step.imageUrl ? (
                        <img
                          src={step.imageUrl}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "drop image"
                      )}
                    </label>

                    {/* DELETE BUTTON — FIXED */}
                    <button
                      onClick={() => removeStep(step.id)}
                      className="absolute top-1 right-1 w-[11px] h-[11px] bg-red-500 rounded-full hover:scale-110 transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
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
      )}
    </div>
  );
}