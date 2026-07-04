import { MapPin, Code2, Plus } from "lucide-react";

export function Navbar({
  onAdd,
  githubUrl,
}: {
  onAdd: () => void;
  githubUrl?: string;
}) {
  const scrollToExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/8 bg-paper-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-marigold-400">
            <MapPin size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-[1.3rem] font-semibold tracking-tight text-ink-950">
            NeighborNet
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <button
            onClick={scrollToExplore}
            className="text-[0.9rem] font-medium text-ash-600 transition hover:text-ink-950"
          >
            Explore the map
          </button>
          <a
            href="#how-it-works"
            className="text-[0.9rem] font-medium text-ash-600 transition hover:text-ink-950"
          >
            How it works
          </a>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[0.9rem] font-medium text-ash-600 transition hover:text-ink-950"
            >
              <Code2 size={16} />
              GitHub
            </a>
          )}
        </nav>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800"
        >
          <Plus size={16} strokeWidth={2.5} className="text-marigold-400" />
          <span className="hidden sm:inline">Add resource</span>
        </button>
      </div>
    </header>
  );
}
