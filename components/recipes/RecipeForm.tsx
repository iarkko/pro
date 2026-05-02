export default function RecipeForm() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">

      <h2 className="font-medium text-white/80">
        Add Recipe
      </h2>

      <input
        className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
        placeholder="Recipe title"
      />

      <textarea
        className="w-full p-3 rounded-xl bg-black/30 border border-white/10 min-h-[90px]"
        placeholder="Ingredients..."
      />

      <textarea
        className="w-full p-3 rounded-xl bg-black/30 border border-white/10 min-h-[120px]"
        placeholder="Steps..."
      />

      <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">
        Save Recipe
      </button>

    </div>
  );
}