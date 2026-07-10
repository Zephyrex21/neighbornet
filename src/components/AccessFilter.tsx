import { ACCESS_TYPES, ACCESS_META, type AccessType } from "../lib/access";

export function AccessFilter({
  selected,
  onChange,
}: {
  selected: AccessType[];
  onChange: (types: AccessType[]) => void;
}) {
  const toggle = (a: AccessType) => {
    if (selected.includes(a)) {
      onChange(selected.filter((x) => x !== a));
    } else {
      onChange([...selected, a]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-wide text-ash-500 dark:text-paper-300/40">
        Access:
      </span>
      {ACCESS_TYPES.map((a) => {
        const meta = ACCESS_META[a];
        const active = selected.includes(a);
        return (
          <button
            key={a}
            onClick={() => toggle(a)}
            className={`rounded-full border px-3 py-1 text-[0.75rem] font-medium transition-all ${
              active
                ? "border-transparent text-white"
                : "border-ink-800/12 bg-white text-ash-600 hover:border-ink-800/25 dark:border-white/12 dark:bg-ink-900 dark:text-paper-300/70"
            }`}
            style={active ? { backgroundColor: meta.color } : undefined}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
