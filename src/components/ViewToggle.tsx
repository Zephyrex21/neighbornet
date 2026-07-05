export function ViewToggle({
  view,
  onChange,
}: {
  view: "map" | "list";
  onChange: (v: "map" | "list") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-ink-800/12 bg-white p-1 shadow-sm dark:border-white/12 dark:bg-ink-900">
      {(["map", "list"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-md px-4 py-1.5 font-mono text-[0.8rem] font-medium uppercase tracking-wide transition-colors ${
            view === v
              ? "bg-ink-900 text-white dark:bg-accent-500"
              : "text-ash-600 hover:text-ink-950 dark:text-paper-300/60 dark:hover:text-white"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
