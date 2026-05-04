export default function StepEditor({ data, index, onChange, onRemove }: any) {
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