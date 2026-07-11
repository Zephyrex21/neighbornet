import { memo } from "react";
import { MapPin, Code2, ExternalLink } from "lucide-react";
import { CATEGORIES, CATEGORY_META } from "../lib/categories";

function FooterImpl({
  githubUrl,
  liveUrl,
}: {
  githubUrl?: string;
  liveUrl?: string;
}) {
  return (
    <footer className="border-t border-ink-800/8 bg-paper-100 text-ink-800 dark:border-white/8 dark:bg-ink-950 dark:text-paper-200">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gradient-brand flex h-7 w-7 items-center justify-center rounded-lg text-white">
                <MapPin size={14} strokeWidth={2.5} />
              </span>
              <span className="font-display text-[1.1rem] font-semibold text-ink-950 dark:text-white">
                NeighborNet
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed text-ash-600 dark:text-paper-300/70">
              A crowdsourced map for essential services — because access
              shouldn't depend on who you know.
            </p>
          </div>

          <div>
            <h4 className="text-[0.78rem] font-semibold uppercase tracking-wide text-ash-500 dark:text-paper-300/50">
              Categories
            </h4>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const Icon = meta.icon;
                return (
                  <li key={cat} className="flex items-center gap-2 text-[0.85rem] text-ash-600 dark:text-paper-300/80">
                    <Icon size={14} strokeWidth={2.25} />
                    {meta.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-[0.78rem] font-semibold uppercase tracking-wide text-ash-500 dark:text-paper-300/50">
              Project
            </h4>
            <ul className="mt-3 space-y-2 text-[0.85rem]">
              {githubUrl && (
                <li>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-ash-600 transition hover:text-ink-950 dark:text-paper-300/80 dark:hover:text-white"
                  >
                    <Code2 size={14} /> GitHub repo
                  </a>
                </li>
              )}
              {liveUrl && (
                <li>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-ash-600 transition hover:text-ink-950 dark:text-paper-300/80 dark:hover:text-white"
                  >
                    <ExternalLink size={14} /> Live app
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-[0.78rem] font-semibold uppercase tracking-wide text-ash-500 dark:text-paper-300/50">
              Built for
            </h4>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-ash-600 dark:text-paper-300/80">
              Ctrl+V Hackathon 2026 — theme: Access.
            </p>
            <p className="mt-3 font-mono text-[0.78rem] leading-relaxed text-ash-500 dark:text-paper-300/50">
              React · TypeScript · Firebase · Leaflet
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800/8 pt-6 text-[0.78rem] text-ash-500 dark:border-white/10 dark:text-paper-300/40">
          © {new Date().getFullYear()} NeighborNet. Built solo for community access.
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterImpl);
