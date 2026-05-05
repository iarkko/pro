"use client";

type StepValue = {
  text: string;
  imageUrl?: string;
};

export default function StepItem({
  text,
  imageUrl,
  onChange,
  onRemove,
}: {
  text: string;
  imageUrl?: string;
  onChange: (val: StepValue) => void;
  onRemove: () => void;
}) {
  function handleFile(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        text,
        imageUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid grid-cols-[1fr_140px] gap-3 relative">

      {/* REMOVE */}
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 text-red-500 text-xs z-10"
      >
        ✕
      </button>

      {/* TEXT */}
      <textarea
        value={text}
        onChange={(e) =>
          onChange({
            text: e.target.value,
            imageUrl,
          })
        }
        className="p-2 bg-white/5 rounded resize-none min-h-[80px]"
        placeholder="Step text"
      />

      {/* DROP ZONE */}
      <div
        className="border border-dashed border-white/20 rounded flex items-center justify-center text-xs text-white/40 overflow-hidden cursor-pointer min-h-[80px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0] || null);
        }}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
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
          "drop / click"
        )}
      </div>

    </div>
  );
}