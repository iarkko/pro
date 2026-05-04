export default function RecipeCard({
  recipe,
}: {
  recipe: { title: string; desc: string };
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

      <div>
        <h3 className="font-medium">{recipe.title}</h3>
        <p className="text-sm text-white/40">{recipe.desc}</p>
      </div>

      <button className="text-white/40 hover:text-white">
        ⋮
      </button>

    </div>
  );
}