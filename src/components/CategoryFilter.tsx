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
        const active = selected.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.83rem] font-medium transition-all ${
              active
                ? "border-transparent text-white shadow-sm"
                : "border-ink-800/12 bg-white text-ash-600 hover:border-ink-800/25"
            }`}
            style={active ? { backgroundColor: meta.color } : undefined}
          >
            <span aria-hidden>{meta.icon}</span>
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
