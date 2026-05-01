"use client";

import { useRef, useState, useEffect } from "react";
import type { Recipe } from "@/types/recipe";

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

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setImageUrl(initialData.imageUrl ?? "");
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
    setImageUrl(data.url ?? "");

    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "edit" && initialData && onUpdated) {
        await onUpdated(initialData.id, {
          title,
          description,
          imageUrl,
          steps: initialData.steps ?? [],
        });
      } else {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
            steps: [],
          }),
        });

        const newRecipe = await res.json();
        onCreated(newRecipe);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-white">

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 bg-zinc-900 rounded"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 bg-zinc-900 rounded"
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      {imageUrl && (
        <img src={imageUrl} className="h-32 object-cover rounded" />
      )}

      <button className="bg-violet-600 px-4 py-2 rounded">
        {mode === "edit" ? "Update" : "Create"}
      </button>

    </form>
  );
}