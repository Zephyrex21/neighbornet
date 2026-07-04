import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or area…"
        className="w-full rounded-lg border border-ink-800/12 bg-white py-2.5 pl-9 pr-3.5 text-sm text-ink-950 placeholder:text-ash-500 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/50"
      />
    </div>
  );
}
