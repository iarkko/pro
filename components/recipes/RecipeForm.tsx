"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  text: string;
  imageUrl?: string;
};

type Props = {
  onSubmit: (data: any) => void;
  initialData?: {
    title: string;
    description?: string;
    imageUrl?: string;
    steps?: Step[];
  };
};

export default function RecipeForm({ onSubmit, initialData }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [steps, setSteps] = useState<Step[]>([]);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setImageUrl(initialData.imageUrl || "");
    setSteps(initialData.steps || []);
  }, [initialData]);

  function handleMainImage(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addStep() {
    setSteps((p) => [...p, { text: "", imageUrl: undefined }]);
  }

  function updateStep(index: number, value: Step) {
    setSteps((p) => {
      const copy = [...p];
      copy[index] = value;
      return copy;
    });
  }

  function removeStep(index: number) {
    setSteps((p) => p.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex gap-6">

        {/* LEFT */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe title"
            className="w-full bg-white/5 p-3 rounded-lg"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-white/5 p-3 rounded-lg h-40 resize-none"
          />
        </div>

        {/* RIGHT IMAGE */}
        <div
          className="w-[260px] h-[160px] border border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-white/5"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleMainImage(e.dataTransfer.files?.[0] || null);
          }}
        >
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              handleMainImage(e.target.files?.[0] || null)
            }
          />

          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/40 text-sm">
              Drop / Click image
            </span>
          )}
        </div>
      </div>

      {/* STEPS */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">

            {/* TEXT */}
            <textarea
              value={step.text}
              onChange={(e) =>
                updateStep(i, { ...step, text: e.target.value })
              }
              className="flex-1 p-3 bg-black/40 rounded-lg"
              placeholder="Step text"
            />

            {/* IMAGE */}
            <label
              className="w-[160px] h-[100px] border border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                  updateStep(i, {
                    ...step,
                    imageUrl: reader.result as string,
                  });
                };
                reader.readAsDataURL(file);
              }}
            >
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    updateStep(i, {
                      ...step,
                      imageUrl: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />

              {step.imageUrl ? (
                <img
                  src={step.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white/40 text-xs">
                  image
                </span>
              )}
            </label>

            <button
              onClick={() => removeStep(i)}
              className="text-red-400 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={addStep}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          Add step
        </button>

        <button
          onClick={() =>
            onSubmit({
              title,
              description,
              imageUrl,
              steps,
            })
          }
          className="flex-1 py-3 bg-green-600 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}