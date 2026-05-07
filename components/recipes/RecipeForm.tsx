"use client";

import { useRef, useState } from "react";
import type { RecipeInput, RecipeStep } from "@/types/recipe";

type Props = {
  onSubmitAction: (data: RecipeInput) => void;
  initialData?: RecipeInput;
};

export default function RecipeForm({ onSubmitAction, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialData?.imageUrl
  );
  const [steps, setSteps] = useState<RecipeStep[]>(
    initialData?.steps?.length
      ? initialData.steps
      : [{ text: "", imageUrl: undefined }]
  );

  const fileRef = useRef<HTMLInputElement | null>(null);

  function handleMainImage(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addStep() {
    setSteps((prev) => [...prev, { text: "", imageUrl: undefined }]);
  }

  function updateStep(index: number, value: RecipeStep) {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[1fr_130px] gap-4 md:grid-cols-[1.6fr_1fr] lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[var(--shadow)]">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Recipe title"
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/60"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full min-h-[110px] rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/60 resize-none"
            />
          </div>
        </div>

        <div
          className="relative rounded-3xl border border-dashed border-white/10 bg-white/5 p-3 text-center text-sm text-slate-300 transition hover:border-indigo-400/30"
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
            onChange={(e) => handleMainImage(e.target.files?.[0] || null)}
          />

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || "Recipe image"}
              className="h-[140px] md:h-[170px] lg:h-[200px] w-full rounded-3xl object-cover"
            />
          ) : (
            <div className="flex h-[140px] md:h-[170px] lg:h-[200px] flex-col items-center justify-center gap-2 rounded-3xl bg-slate-950/60 px-3">
              <span className="text-sm text-slate-400">
                Drop or click to add a cover image
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                Upload image
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-100">Steps</p>
            <p className="text-sm text-slate-500">
              Add step text and optional step image.
            </p>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            + Add step
          </button>
        </div>

        <div className={`${steps.length > 3 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5 sm:grid-cols-[1fr_170px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm text-slate-300">
                    Step {index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={step.text}
                  onChange={(e) =>
                    updateStep(index, { ...step, text: e.target.value })
                  }
                  placeholder="Step description"
                  className="h-[120px] w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/60 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-slate-300">Step image</label>
                <div
                  className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/10 bg-slate-900/60 text-center text-sm text-slate-500 transition hover:border-indigo-400/30 cursor-pointer"
                  onClick={() =>
                    document
                      .getElementById(`step-image-${index}`)
                      ?.click()
                  }
                >
                  <input
                    id={`step-image-${index}`}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        updateStep(index, {
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
                      alt={`Step ${index + 1} image`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-400">
                      Upload or drag a step image
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() =>
            onSubmitAction({
              title,
              description,
              imageUrl,
              steps,
            })
          }
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(52,211,153,0.18)] transition hover:bg-emerald-400"
        >
          Save recipe
        </button>
      </div>
    </div>
  );
}
