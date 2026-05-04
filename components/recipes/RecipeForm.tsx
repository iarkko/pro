"use client";

import { useRef, useState } from "react";
import StepItem from "@/components/recipes/StepItem";

type Step = {
  text: string;
  imageUrl?: string;
};

export default function RecipeForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [steps, setSteps] = useState<Step[]>([]);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleMainImage = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addStep = () => {
    setSteps([...steps, { text: "", imageUrl: undefined }]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* MAIN IMAGE */}
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
          onChange={(e) => handleMainImage(e.target.files?.[0] || null)}
        />

        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/40">Drop / Click main image</span>
        )}
      </div>

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe title"
        className="w-full bg-white/5 p-3 rounded-lg outline-none"
      />

      {/* DESCRIPTION */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full bg-white/5 p-3 rounded-lg outline-none min-h-[80px]"
      />

      {/* STEPS */}
      <div
        className={
          steps.length > 4
            ? "grid grid-cols-2 gap-4"
            : "space-y-4"
        }
      >
        {steps.map((step, index) => (
          <StepItem
            key={index}
            index={index}
            text={step.text}
            imageUrl={step.imageUrl}
            onChange={(updated) => {
              const newSteps = [...steps];
              newSteps[index] = updated;
              setSteps(newSteps);
            }}
            onRemove={() => {
              setSteps(steps.filter((_, i) => i !== index));
            }}
          />
        ))}
      </div>

      {/* ADD STEP */}
      <button
        onClick={addStep}
        className="px-4 py-2 bg-indigo-600 rounded-lg"
      >
        Add step
      </button>

      {/* SUBMIT */}
      <button
        onClick={() =>
          onSubmit({
            title,
            description,
            imageUrl,
            steps,
          })
        }
        className="w-full py-3 bg-green-600 rounded-lg"
      >
        Save recipe
      </button>
    </div>
  );
}