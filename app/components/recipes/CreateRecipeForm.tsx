"use client";

import { useRef, useState, useEffect } from "react";
import type { Recipe, RecipeStep } from "@/types/recipe";
import StepEditor from "./StepEditor";

type Props = {
  onCreated: (recipe: Recipe) => void;
  onUpdated?: (id: string, data: Partial<Recipe>) => void;
  mode?: "create" | "edit";
  initialData?: Recipe | null;
};

export default function CreateRecipeForm({
  onCreated,
  onUpdated,
  mode = "create",
  initialData,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setImageUrl(initialData.imageUrl ?? "");
      setSteps(initialData.steps ?? []);
    }
  }, [mode, initialData]);

  const uploadFile = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.url);

    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      description,
      imageUrl,
      steps,
    };

    try {
      if (mode === "edit" && initialData && onUpdated) {
        await onUpdated(initialData.id, payload);
      } else {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        onCreated(data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-white">

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-zinc-900 rounded-xl"
        placeholder="Title"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 bg-zinc-900 rounded-xl h-24"
        placeholder="Description"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-white/20 p-6 rounded-xl text-center cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />

        {uploading
          ? "Uploading..."
          : imageUrl
          ? "Image uploaded"
          : "Click to upload image"}
      </div>

      <StepEditor value={steps} onChange={setSteps} />

      <button className="w-full bg-violet-600 p-3 rounded-xl">
        {mode === "edit" ? "Update" : "Create"}
      </button>
    </form>
  );
}