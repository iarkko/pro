"use client";

import { useRef } from "react";

export type RecipeStep = {
  text: string;
  imageUrl?: string;
};

type Props = {
  value: RecipeStep[];
  onChange: (steps: RecipeStep[]) => void;
};

export default function StepEditor({ value, onChange }: Props) {
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateStep = (index: number, patch: Partial<RecipeStep>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  };

  const removeStep = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addStep = () => {
    onChange([...value, { text: "", imageUrl: "" }]);
  };

  const uploadImage = async (file: File, index: number) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    updateStep(index, { imageUrl: data.url });
  };

  const gridClass =
    value.length > 4 ? "grid grid-cols-2 gap-3" : "space-y-3";

  return (
    <div className={gridClass}>
      {value.map((step, i) => (
        <div
          key={i}
          className="relative border border-white/10 rounded-xl bg-[#0b0f1a]/60 p-3"
        >
          {/* 🔴 DELETE ONLY IN EDIT MODE */}
          <button
            onClick={() => removeStep(i)}
            className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400"
          />

          {/* IMAGE */}
          <div
            className="w-full h-32 border border-white/10 rounded-lg overflow-hidden mb-2 flex items-center justify-center cursor-pointer"
            onClick={() => fileRefs.current[i]?.click()}
          >
            {step.imageUrl ? (
              <img
                src={step.imageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white/30 text-sm">
                Add image
              </span>
            )}
          </div>

          <input
            ref={(el) => {
              fileRefs.current[i] = el;
            }}
            type="file"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await uploadImage(file, i);
            }}
          />

          {/* TEXT */}
          <textarea
            value={step.text}
            onChange={(e) =>
              updateStep(i, { text: e.target.value })
            }
            className="w-full bg-transparent text-white text-sm outline-none resize-none mt-2"
            placeholder="Step description..."
          />
        </div>
      ))}

      {/* ADD STEP */}
      <button
        onClick={addStep}
        className="w-full py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20"
      >
        + Add step
      </button>
    </div>
  );
}