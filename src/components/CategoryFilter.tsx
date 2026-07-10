import { CATEGORIES, CATEGORY_META, type Category } from "../lib/categories";

export function CategoryFilter({
  selected,
  onChange,
}: {
  selected: Category[];
  onChange: (categories: Category[]) => void;
}) {
  const toggle = (cat: Category) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        const Icon = meta.icon;
        const active = selected.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-mono text-[0.78rem] font-medium uppercase tracking-wide transition active:scale-95 ${
              active
                ? "border-transparent text-white shadow-sm"
                : "border-ink-800/12 bg-white text-ash-600 hover:border-ink-800/25 dark:border-white/12 dark:bg-ink-900 dark:text-paper-300/70 dark:hover:border-white/25"
            }`}
            style={active ? { backgroundColor: meta.color } : undefined}
          >
            <Icon size={15} strokeWidth={2.25} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
