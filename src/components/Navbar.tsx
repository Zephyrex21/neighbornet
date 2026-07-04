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
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white shadow-[0_0_20px_-4px_rgba(99,102,241,0.7)]">
            <MapPin size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-[1.25rem] font-semibold tracking-tight text-white">
            NeighborNet
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <button
            onClick={scrollToExplore}
            className="text-[0.88rem] font-medium text-paper-300/70 transition hover:text-white"
          >
            Explore the map
          </button>
          <a
            href="#how-it-works"
            className="text-[0.88rem] font-medium text-paper-300/70 transition hover:text-white"
          >
            How it works
          </a>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[0.88rem] font-medium text-paper-300/70 transition hover:text-white"
            >
              <Code2 size={16} />
              GitHub
            </a>
          )}
        </nav>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_-6px_rgba(99,102,241,0.8)] transition hover:bg-accent-600"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add resource</span>
        </button>
      </div>
    </header>
  );
}
