"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  id: string;
  text: string;
  imageUrl: string | null;
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

/* IMAGE VIEWER */
function ImageViewer({ src, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <img src={src} className="max-w-[90vw] max-h-[90vh]" />
    </div>
  );
}

/* CARD */
function RecipeCard({ r, onDelete, onImage }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-3 bg-white/5 rounded-xl space-y-2">

      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <img
          src={r.imageUrl}
          className="w-full h-32 object-cover rounded"
          onClick={(e) => {
            e.stopPropagation();
            onImage(r.imageUrl);
          }}
        />
        <h3 className="font-bold mt-2">{r.title}</h3>
        <p className="text-xs text-white/60">{r.description}</p>
      </div>

      {open && (
        <div className="space-y-2">
          {(r.steps ?? []).map((s: Step, i: number) => (
            <div key={s.id} className="flex gap-2 bg-white/5 p-2 rounded">

              <div className="text-xs flex-1">
                {i + 1}. {s.text}
              </div>

              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  className="w-20 h-20 object-cover cursor-pointer"
                  onClick={() => onImage(s.imageUrl)}
                />
              )}
            </div>
          ))}

          <button
            onClick={() => onDelete(r.id)}
            className="text-red-400"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* PAGE */
export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    steps: [{ id: uid(), text: "", imageUrl: null as string | null }],
  });

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then(setRecipes);
  }, []);

  function onMainImage(file: File | null) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () =>
      setForm((p) => ({ ...p, imageUrl: r.result as string }));
    r.readAsDataURL(file);
  }

  function addStep() {
    setForm((p) => ({
      ...p,
      steps: [...p.steps, { id: uid(), text: "", imageUrl: null }],
    }));
  }

  function updateStep(id: string, text: string) {
    setForm((p) => ({
      ...p,
      steps: p.steps.map((s) =>
        s.id === id ? { ...s, text } : s
      ),
    }));
  }

  function setStepImage(id: string, file: File | null) {
    if (!file) return;

    const r = new FileReader();
    r.onload = () =>
      setForm((p) => ({
        ...p,
        steps: p.steps.map((s) =>
          s.id === id ? { ...s, imageUrl: r.result as string } : s
        ),
      }));

    r.readAsDataURL(file);
  }

  async function save() {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title || "Untitled",
        description: form.description,
        imageUrl: form.imageUrl,
        steps: form.steps.map((s) => ({
          text: s.text,
          imageUrl: s.imageUrl,
        })),
      }),
    });

    const data = await res.json();
    setRecipes((p) => [data, ...p]);
    setOpen(false);
  }

  const stepCols =
    form.steps.length > 3 ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Recipes</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 px-4 py-2"
        >
          + Add
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            r={r}
            onImage={setZoom}
            onDelete={async (id: string) => {
              await fetch(`/api/recipes/${id}`, {
                method: "DELETE",
              });
              setRecipes((p) => p.filter((x) => x.id !== id));
            }}
          />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 p-10">
          <div className="bg-[#0B1020] p-6 rounded-xl space-y-6 max-w-6xl mx-auto">

            {/* HEADER */}
            <div className="flex gap-6 h-[140px]">

              <div className="w-[65%] flex flex-col gap-4">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="bg-white/5 p-3 rounded"
                  placeholder="Recipe title"
                />

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="bg-white/5 p-3 rounded flex-1"
                />
              </div>

              <div
                className="w-[35%] border border-dashed"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  onChange={(e) =>
                    onMainImage(e.target.files?.[0] || null)
                  }
                />

                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Drop image"
                )}
              </div>
            </div>

            {/* STEPS */}
            <div className={`grid ${stepCols} gap-3`}>
              {form.steps.map((s) => (
                <div key={s.id} className="flex gap-3">

                  <textarea
                    value={s.text}
                    onChange={(e) =>
                      updateStep(s.id, e.target.value)
                    }
                    className="flex-1 bg-black/40 p-2"
                  />

                  <div className="flex flex-col gap-2">

                    <button
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          steps: p.steps.filter(
                            (x) => x.id !== s.id
                          ),
                        }))
                      }
                      className="text-red-500"
                    >
                      ●
                    </button>

                    <div
                      className="w-[120px] h-[90px] border border-dashed"
                      onClick={() =>
                        document
                          .getElementById(`s-${s.id}`)
                          ?.click()
                      }
                    >
                      <input
                        id={`s-${s.id}`}
                        type="file"
                        hidden
                        onChange={(e) =>
                          setStepImage(
                            s.id,
                            e.target.files?.[0] || null
                          )
                        }
                      />

                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "img"
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={addStep}>+ step</button>
              <button
                onClick={save}
                className="bg-green-600 px-4 py-2"
              >
                save
              </button>
            </div>

          </div>
        </div>
      )}

      {zoom && (
        <ImageViewer
          src={zoom}
          onClose={() => setZoom(null)}
        />
      )}
    </div>
  );
}