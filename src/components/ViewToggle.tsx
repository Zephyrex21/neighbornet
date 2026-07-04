export function ViewToggle({
  view,
  onChange,
}: {
  view: "map" | "list";
  onChange: (v: "map" | "list") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-ink-800/12 bg-white p-1 shadow-sm">
      {(["map", "list"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
            view === v
              ? "bg-ink-900 text-white"
              : "text-ash-600 hover:text-ink-950"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
