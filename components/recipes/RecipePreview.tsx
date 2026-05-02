export default function RecipePreview({ recipe, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/90 p-4">
      <div className="max-w-xl mx-auto">

        <button onClick={onClose}>Close</button>

        <h1>{recipe.title}</h1>

        <p>{recipe.description}</p>

        {recipe.steps?.map((s: any) => (
          <div key={s.id} className="p-2 bg-white/5">
            {s.text}
          </div>
        ))}

      </div>
    </div>
  );
}