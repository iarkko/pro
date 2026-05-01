"use client";

import { useState } from "react";

export default function CommandPalette({
  open,
  onClose,
  onCreate,
  onSearch,
}: any) {
  const [value, setValue] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-32 z-50">
      <div className="w-[520px] bg-zinc-900 border border-white/10 rounded-xl p-3">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type command..."
          className="w-full bg-zinc-800 p-2 rounded text-sm outline-none"
        />

        <div className="mt-3 space-y-2 text-sm">
          <button onClick={onCreate} className="hover:text-white text-white/60">
            + Create recipe
          </button>

          <button onClick={() => onSearch(value)} className="hover:text-white text-white/60">
            Search: {value}
          </button>

          <button onClick={onClose} className="text-white/40">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}