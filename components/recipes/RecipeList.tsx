import RecipeCard from "./RecipeCard";
import type { Recipe } from "@/types/recipe";

const mock: Recipe[] = [
  {
    id: "pancakes",
    title: "Pancakes",
    description: "Fluffy breakfast pancakes",
    imageUrl: "",
    steps: [],
  },
  {
    id: "carbonara",
    title: "Carbonara",
    description: "Classic Italian pasta",
    imageUrl: "",
    steps: [],
  },
  {
    id: "greek-salad",
    title: "Greek Salad",
    description: "Fresh vegetables & feta",
    imageUrl: "",
    steps: [],
  },
];

export default function RecipeList() {
  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-white/80 font-medium">
          Your Recipes
        </h2>
        <span className="text-xs text-white/40">
          {mock.length}
        </span>
      </div>

      {/* 🔥 GRID вместо списка */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mock.map((r, i) => (
          <RecipeCard key={r.id ?? i} r={r} onDelete={() => {}} />
        ))}
      </div>

    </div>
  );
}
