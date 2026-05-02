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
  steps: string[]; // backend compatible
};

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingMain, setUploadingMain] = useState(false);

  const [form, setForm] = useState<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    steps: Step[];
  }>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    steps: [{ id: uid(), text: "" }],
  });

  async function load() {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    setRecipes(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const payload = {
      ...form,
      steps: form.steps.map((s) => s.text),
    };

    if (editingId) {
      await fetch(`/api/recipes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setOpenForm(false);
    setEditingId(null);

    setForm({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      steps: [{ id: uid(), text: "" }],
    });

    load();
  }

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
    } else if (type === "step" && stepId) {
      setForm((p) => ({
        ...p,
        steps: p.steps.map((s) =>
          s.id === stepId ? { ...s, imageUrl: data.url } : s
        ),
      }));
    }
  }

  function onDropMain(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file, "main");
  }

  function onDropStep(e: React.DragEvent, stepId: string) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file, "step", stepId);
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
      steps: p.steps.map((s) => (s.id === id ? { ...s, text: value } : s)),
    }));
  }

  function removeStep(id: string) {
    setForm((p) => ({
      ...p,
      steps: p.steps.filter((s) => s.id !== id),
    }));
  }

  function moveStep(from: number, to: number) {
    const steps = [...form.steps];
    const [moved] = steps.splice(from, 1);
    steps.splice(to, 0, moved);
    setForm((p) => ({ ...p, steps }));
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

      {openForm && (
        <div className="p-6 bg-white/5 rounded-xl space-y-4">

          <input
            placeholder="Title"
            className="w-full p-2 bg-black/30 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Description"
            className="w-full p-2 bg-black/30 rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* MAIN IMAGE DROP */}
          <div
            onDrop={onDropMain}
            onDragOver={(e) => e.preventDefault()}
            className="h-40 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/40"
          >
            {form.imageUrl ? "Main image uploaded" : "Drop main image here"}
          </div>

          {form.imageUrl && (
            <img src={form.imageUrl} className="rounded-lg max-h-60" />
          )}

          {/* STEPS */}
          <div className="space-y-2">

            <div className="flex justify-between">
              <p>Steps</p>
              <button onClick={addStep}>+ step</button>
            </div>

            <div className={`grid gap-2 ${form.steps.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>

              {form.steps.map((step, i) => (
                <div
                  key={step.id}
                  className="p-2 bg-black/30 rounded space-y-2"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const from = Number(e.dataTransfer.getData("from"));
                    moveStep(from, i);
                  }}
                >

                  <div className="flex items-center gap-2">

                    <div
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("from", i.toString())
                      }
                      className="cursor-grab text-white/40"
                    >
                      ⋮⋮
                    </div>

                    <input
                      value={step.text}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />

                    <button
                      onClick={() => removeStep(step.id)}
                      className="w-2 h-2 bg-red-500 rounded-full"
                    />
                  </div>

                  {/* STEP IMAGE DROP */}
                  <div
                    onDrop={(e) => onDropStep(e, step.id)}
                    onDragOver={(e) => e.preventDefault()}
                    className="h-24 border border-dashed border-white/10 rounded flex items-center justify-center text-white/30 text-xs"
                  >
                    {step.imageUrl ? "image added" : "drop step image"}
                  </div>

                  {step.imageUrl && (
                    <img src={step.imageUrl} className="rounded" />
                  )}

                </div>
              ))}

            </div>
          </div>

          <button onClick={save} className="px-4 py-2 bg-green-600 rounded">
            Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {recipes.map((r) => (
          <div key={r.id} className="p-4 bg-white/5 rounded-xl">
            {r.imageUrl && <img src={r.imageUrl} className="rounded-lg" />}
            <h3 className="font-bold">{r.title}</h3>
            <p className="text-sm text-white/60">{r.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
