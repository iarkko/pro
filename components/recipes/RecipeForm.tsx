/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import type { RecipeInput, RecipeStep } from "@/types/recipe";

type Props = {
  initialData?: Partial<RecipeInput>;
  onSubmitAction: (data: RecipeInput) => Promise<void> | void;
  submitLabel?: string;
};

const emptyStep = (): RecipeStep => ({
  text: "",
  imageUrl: "",
});

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await res.json()) as { url?: string; error?: string };

  if (!res.ok || !payload.url) {
    throw new Error(payload.error ?? "Image upload failed");
  }

  return payload.url;
}

export default function RecipeForm({
  initialData,
  onSubmitAction,
  submitLabel = "Save recipe",
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [steps, setSteps] = useState<RecipeStep[]>(
    initialData?.steps?.length ? initialData.steps : [emptyStep()]
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingStepIndex, setUploadingStepIndex] = useState<number | null>(
    null
  );

  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleCoverImage(file: File | null) {
    if (!file) return;

    setError(null);
    setUploadingCover(true);

    try {
      setImageUrl(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleStepImage(index: number, file: File | null) {
    if (!file) return;

    setError(null);
    setUploadingStepIndex(index);

    try {
      const uploadedUrl = await uploadImage(file);
      setSteps((prev) =>
        prev.map((step, stepIndex) =>
          stepIndex === index ? { ...step, imageUrl: uploadedUrl } : step
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingStepIndex(null);
    }
  }

  function addStep() {
    setSteps((prev) => [...prev, emptyStep()]);
  }

  function updateStep(index: number, value: RecipeStep) {
    setSteps((prev) =>
      prev.map((step, stepIndex) => (stepIndex === index ? value : step))
    );
  }

  function removeStep(index: number) {
    setSteps((prev) =>
      prev.length === 1 ? [emptyStep()] : prev.filter((_, i) => i !== index)
    );
  }

  function handleCoverDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    void handleCoverImage(event.dataTransfer.files?.[0] ?? null);
  }

  function handleStepDrop(index: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    void handleStepImage(index, event.dataTransfer.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedSteps = steps
      .map((step) => ({
        text: step.text.trim(),
        imageUrl: step.imageUrl || "",
      }))
      .filter((step) => step.text || step.imageUrl);

    if (!normalizedTitle) {
      setError("Add a recipe title before saving.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await onSubmitAction({
        title: normalizedTitle,
        description: description.trim(),
        imageUrl,
        steps: normalizedSteps,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recipe save failed");
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || uploadingCover || uploadingStepIndex !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-[var(--shadow)]">
          <div className="space-y-2">
            <label
              htmlFor="recipe-title"
              className="block text-sm font-semibold text-slate-200"
            >
              Title
            </label>
            <input
              id="recipe-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pasta with tomato sauce"
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/70"
            />
          </div>

          <div className="mt-4 space-y-2">
            <label
              htmlFor="recipe-description"
              className="block text-sm font-semibold text-slate-200"
            >
              Description
            </label>
            <textarea
              id="recipe-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about ingredients, timing, or serving."
              className="min-h-32 w-full resize-none rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/70"
            />
          </div>
        </div>

        <div
          className="relative min-h-60 cursor-pointer overflow-hidden rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-3 text-center text-sm text-slate-300 transition hover:border-teal-300/50"
          onClick={() => fileRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleCoverDrop}
        >
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => void handleCoverImage(e.target.files?.[0] ?? null)}
          />

          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={title || "Recipe cover"}
                className="h-full min-h-56 w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setImageUrl("");
                }}
                className="absolute right-5 top-5 rounded-lg bg-slate-950/85 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-900"
              >
                Remove
              </button>
            </>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-md bg-slate-950/60 px-4">
              <span className="font-semibold text-slate-200">
                {uploadingCover ? "Uploading..." : "Cover image"}
              </span>
              <span className="mt-2 text-xs leading-5 text-slate-500">
                Click or drop an image. JPG, PNG, WebP or GIF up to 5 MB.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Steps</h3>
            <p className="mt-1 text-sm text-slate-500">
              Add preparation text and an optional image for each step.
            </p>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-400"
          >
            Add step
          </button>
        </div>

        <div
          className={`mt-5 grid gap-4 ${
            steps.length > 2 ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-lg border border-white/10 bg-slate-950/70 p-4 sm:grid-cols-[1fr_160px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor={`recipe-step-${index}`}
                    className="text-sm font-semibold text-slate-300"
                  >
                    Step {index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  id={`recipe-step-${index}`}
                  value={step.text}
                  onChange={(e) =>
                    updateStep(index, { ...step, text: e.target.value })
                  }
                  placeholder="Describe this step"
                  className="h-36 w-full resize-none rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/70"
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor={`step-image-${index}`}
                  className="text-sm font-semibold text-slate-300"
                >
                  Image
                </label>
                <div
                  className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/15 bg-slate-900/70 text-center text-sm text-slate-500 transition hover:border-teal-300/50"
                  onClick={() =>
                    document.getElementById(`step-image-${index}`)?.click()
                  }
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleStepDrop(index, event)}
                >
                  <input
                    id={`step-image-${index}`}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      void handleStepImage(index, e.target.files?.[0] ?? null)
                    }
                  />

                  {step.imageUrl ? (
                    <>
                      <img
                        src={step.imageUrl}
                        alt={`Step ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          updateStep(index, { ...step, imageUrl: "" });
                        }}
                        className="absolute right-2 top-2 rounded-lg bg-slate-950/85 px-2 py-1 text-xs font-semibold text-white transition hover:bg-slate-900"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="px-3">
                      {uploadingStepIndex === index
                        ? "Uploading..."
                        : "Click or drop image"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Empty steps are ignored when the recipe is saved.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
