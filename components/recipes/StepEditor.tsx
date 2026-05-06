import type { RecipeStep } from "@/types/recipe";

export default function StepEditor({
  data,
  index,
  onChange,
  onRemove,
}: {
  data: RecipeStep;
  index: number;
  onChange: (index: number, data: RecipeStep) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="bg-white/5 p-2 rounded">
      <input
        value={data.text}
        onChange={(e) =>
          onChange(index, { ...data, text: e.target.value })
        }
      />

      <button onClick={() => onRemove(index)}>
        Remove
      </button>
    </div>
  );
}
