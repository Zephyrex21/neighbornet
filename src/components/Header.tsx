export function Header({
  onLocate,
  locating,
  onAdd,
}: {
  onLocate: () => void;
  locating: boolean;
  onAdd: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-paper-300 bg-paper-50 px-5 py-3.5">
      <div className="flex items-baseline gap-2.5">
        <h1 className="font-display text-[1.5rem] font-semibold tracking-tight text-ink-950">
          NeighborNet
        </h1>
        <p className="hidden text-[0.8rem] text-ash-500 sm:block">
          Find essential services near you
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onLocate}
          disabled={locating}
          className="flex items-center gap-1.5 rounded-full border border-ink-800/15 bg-white px-3.5 py-2 text-sm font-medium text-ink-800 shadow-sm transition hover:border-ink-800/30 hover:shadow disabled:opacity-50"
        >
          <span aria-hidden>📍</span>
          <span className="hidden sm:inline">{locating ? "Locating…" : "Near me"}</span>
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800"
        >
          <span aria-hidden className="text-marigold-400">+</span>
          <span>Add resource</span>
        </button>
      </div>
    </header>
  );
}
