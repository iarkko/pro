"use client";

import { useState } from "react";

export default function RecipeCard({
  recipe,
}: {
  recipe: { title: string; desc: string };
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔧 mock steps (пока нет реальных)
  const steps = [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
  ];

  const isGrid = steps.length > 4;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="relative p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer text-sm"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{recipe.title}</h3>
          <p className="text-xs text-white/40">{recipe.desc}</p>
        </div>

        {/* ⚙️ MENU */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="text-white/40 hover:text-white"
          >
            ⚙️
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-black/80 backdrop-blur border border-white/10 rounded p-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("edit (not wired yet)");
                }}
                className="block w-full text-left px-2 py-1 hover:bg-white/10"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete recipe?")) {
                    alert("delete (not wired yet)");
                  }
                }}
                className="block w-full text-left px-2 py-1 text-red-400 hover:bg-white/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      <div
        className={`transition-all duration-300 ${
          expanded ? "max-h-[500px] mt-3" : "max-h-0 overflow-hidden"
        }`}
      >
        <div
          className={
            isGrid
              ? "grid grid-cols-2 gap-2"
              : "flex flex-col gap-2"
          }
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-2 rounded bg-white/5 text-xs text-white/70"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}