"use client";

import { useRef } from "react";

type Props = {
  index: number;
  text: string;
  imageUrl?: string;
  onChange: (value: { text: string; imageUrl?: string }) => void;
  onRemove: () => void;
};

export default function StepItem({
  index,
  text,
  imageUrl,
  onChange,
  onRemove,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        text,
        imageUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative p-4 rounded-xl bg-white/5 border border-white/10">

      {/* ❌ DELETE (top right of whole step) */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500 hover:scale-110 transition"
      />

      {/* STEP NUMBER */}
      <p className="text-xs text-white/40 mb-3">
        Step {index + 1}
      </p>

      {/* MAIN LAYOUT */}
      <div className="flex items-start gap-4">

        {/* LEFT: TEXT */}
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) =>
              onChange({
                text: e.target.value,
                imageUrl,
              })
            }
            placeholder="Write step..."
            className="w-full bg-transparent outline-none text-white resize-none min-h-[80px]"
          />
        </div>

        {/* RIGHT: IMAGE DROP ZONE */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0] || null);
          }}
          className="w-28 h-28 shrink-0 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center cursor-pointer overflow-hidden"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleFile(e.target.files?.[0] || null)
            }
          />

          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-white/40 text-center px-2">
              Drop / Click
            </span>
          )}
        </div>
      </div>
    </div>
  );
}