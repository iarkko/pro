import Link from "next/link";

export default function RecipeCard({
  r,
  onDelete,
}: any) {
  if (!r) return null;

  return (
    <div className="p-3 bg-white/5 rounded-xl space-y-2">

      <Link href={`/recipes/${r.id || ""}`}>
        {r.imageUrl && (
          <img
            src={r.imageUrl}
            className="rounded-lg h-40 w-full object-cover"
          />
        )}

        <h3 className="font-bold mt-2">
          {r.title || "Untitled"}
        </h3>

        <p className="text-xs text-white/60">
          {r.description || ""}
        </p>
      </Link>

      <div className="flex justify-end gap-3">
        <Link
          href={`/recipes/${r.id || ""}/edit`}
          className="text-xs text-blue-400"
        >
          Edit
        </Link>

        <button
          onClick={() => r?.id && onDelete(r.id)}
          className="text-xs text-red-400"
        >
          Delete
        </button>
      </div>

    </div>
  );
}