"use client";

import { useState, useRef } from "react";

export type Step = {
  id: string;
  text: string;
  image?: string | null;
};

type Props = {
  value: Step[];
  onChange: (steps: Step[]) => void;
};

export default function StepEditor({ value, onChange }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addStep = () => {
    onChange([
      ...value,
      { id: crypto.randomUUID(), text: "", image: null },
    ]);
  };

  const updateStep = (i: number, patch: Partial<Step>) => {
    const copy = [...value];
    copy[i] = { ...copy[i], ...patch };
    onChange(copy);
  };

  const deleteStep = (i: number) => {
    onChange(value.filter((_, index) => index !== i));
  };

  const uploadImage = async (file: File, index: number) => {
    setUploadingIndex(index);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    updateStep(index, { image: data.url });

    setUploadingIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file, index);
  };

  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-white/50 text-sm">Steps</h3>

        <button
          type="button"
          onClick={addStep}
          className="text-violet-400 text-sm"
        >
          + Add step
        </button>
      </div>

      {/* STEPS */}
      <div className="space-y-2">
        {value.map((step, i) => (
          <div
            key={step.id}
            className="relative p-3 bg-zinc-900 border border-white/10 rounded-xl flex gap-3 items-center"
          >
            {/* 🔴 DELETE DOT */}
            <button
              type="button"
              onClick={() => deleteStep(i)}
              className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-400 transition"
              title="Delete step"
            />

            {/* TEXT */}
            <input
              value={step.text}
              onChange={(e) =>
                updateStep(i, { text: e.target.value })
              }
              placeholder={`Step ${i + 1}`}
              className="flex-1 bg-zinc-800 p-3 rounded outline-none text-base text-white"
            />

            {/* IMAGE DROP ZONE */}
            <div
              onClick={() => fileRefs.current[i]?.click()}
              onDrop={(e) => handleDrop(e, i)}
              onDragOver={(e) => e.preventDefault()}
              className="w-24 h-16 border border-dashed border-white/20 rounded-md flex items-center justify-center overflow-hidden cursor-pointer bg-zinc-950 hover:border-violet-500 transition"
            >
              <input
                ref={(el) => {
                  fileRefs.current[i] = el;
                }}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, i);
                }}
              />

              {uploadingIndex === i ? (
                <span className="text-[10px] text-white/40">
                  uploading...
                </span>
              ) : step.image ? (
                <img
                  src={step.image}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-white/30 text-center">
                  drop
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}