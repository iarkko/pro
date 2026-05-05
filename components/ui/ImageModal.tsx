"use client";

export default function ImageModal({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <img
        src={src}
        className="max-w-[92%] max-h-[92%] object-contain rounded-lg"
      />
    </div>
  );
}