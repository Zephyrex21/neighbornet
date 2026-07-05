import { useState } from "react";
import { MapPin, Code2, Plus, Menu, X, Sun, Moon } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

export function Navbar({
  onAdd,
  githubUrl,
  theme,
  onToggleTheme,
}: {
  onAdd: () => void;
  githubUrl?: string;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToExplore = () => {
    setMobileOpen(false);
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-ink-800/8 bg-paper-50/90 backdrop-blur-md dark:border-white/8 dark:bg-ink-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white shadow-[0_0_20px_-4px_rgba(99,102,241,0.7)]">
            <MapPin size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-[1.25rem] font-semibold tracking-tight text-ink-950 dark:text-white">
            NeighborNet
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <button
            onClick={scrollToExplore}
            className="text-[0.88rem] font-medium text-ash-600 transition hover:text-ink-950 dark:text-paper-300/70 dark:hover:text-white"
          >
            Explore the map
          </button>
          <a
            href="#how-it-works"
            className="text-[0.88rem] font-medium text-ash-600 transition hover:text-ink-950 dark:text-paper-300/70 dark:hover:text-white"
          >
            How it works
          </a>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[0.88rem] font-medium text-ash-600 transition hover:text-ink-950 dark:text-paper-300/70 dark:hover:text-white"
            >
              <Code2 size={16} />
              GitHub
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ash-600 transition hover:bg-ink-800/8 hover:text-ink-950 dark:text-paper-300/70 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_-6px_rgba(99,102,241,0.8)] transition hover:bg-accent-600"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add resource</span>
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ash-600 transition hover:bg-ink-800/8 hover:text-ink-950 dark:text-paper-300/80 dark:hover:bg-white/10 dark:hover:text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink-800/8 px-5 py-3 dark:border-white/8 md:hidden">
          <button
            onClick={scrollToExplore}
            className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-ash-600 transition hover:bg-ink-800/5 hover:text-ink-950 dark:text-paper-300/80 dark:hover:bg-white/5 dark:hover:text-white"
          >
            Explore the map
          </button>
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-ash-600 transition hover:bg-ink-800/5 hover:text-ink-950 dark:text-paper-300/80 dark:hover:bg-white/5 dark:hover:text-white"
          >
            How it works
          </a>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium text-ash-600 transition hover:bg-ink-800/5 hover:text-ink-950 dark:text-paper-300/80 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Code2 size={16} />
              GitHub
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
