import RecipeCard from "./RecipeCard";

const mock = [
  {
    title: "Pancakes",
    desc: "Fluffy breakfast pancakes",
  },
  {
    title: "Carbonara",
    desc: "Classic Italian pasta",
  },
  {
    title: "Greek Salad",
    desc: "Fresh vegetables & feta",
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

      <div className="space-y-4">
        {mock.map((r, i) => (
          <RecipeCard key={i} recipe={r} />
        ))}
      </div>

    </div>
  );
}