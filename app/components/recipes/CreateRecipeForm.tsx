"use client";

import { useEffect, useState } from "react";
import type { Recipe } from "@/types/recipe";
import StepEditor, { RecipeStep } from "./StepEditor";

type Props = {
  mode: "create" | "edit";
  initialData: Recipe | null;
  onCreated: (r: Recipe) => void;
  onUpdated: (id: string, data: Partial<Recipe>) => void;
};

export default function CreateRecipeForm({
  mode,
  initialData,
  onCreated,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  // 🔁 fill form when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setImageUrl(initialData.imageUrl ?? "");
      setSteps(initialData.steps ?? []);
    } else {
      setTitle("");
      setDescription("");
      setImageUrl("");
      setSteps([]);
    }
  }, [initialData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      imageUrl,
      steps,
    };

    if (mode === "create") {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      onCreated(data);
    }

    if (mode === "edit" && initialData) {
      const res = await fetch(`/api/recipes/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      onUpdated(initialData.id, data);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-white">

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3"
      />

      {/* DESCRIPTION */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3"
      />

      {/* IMAGE */}
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3"
      />

      {/* STEPS */}
      <StepEditor value={steps} onChange={setSteps} />

      {/* SUBMIT */}
      <button className="w-full bg-violet-600 p-3 rounded-xl">
        {mode === "edit" ? "Update" : "Create"}
      </button>

    </form>
  );
}