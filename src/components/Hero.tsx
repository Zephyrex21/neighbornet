import { memo } from "react";
import { Search, Compass, Plus } from "lucide-react";
import { CATEGORIES, CATEGORY_META } from "../lib/categories";

function HeroImpl({ onAdd }: { onAdd: () => void }) {
  const scrollToExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section
        id="top"
        className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-paper-50 to-paper-100 dark:from-ink-950 dark:to-ink-900"
      >
        <div className="bg-grid absolute inset-0 opacity-60" />

        {/* Floating gradient orbs — radial-gradient, not filter:blur(), so
            they're cheap to composite even while animating (see index.css) */}
        <div
          className="orb orb-1 -top-16 left-1/4 h-80 w-80"
          style={{ "--orb-color": "rgba(139,92,246,0.35)" } as React.CSSProperties}
          aria-hidden
        />
        <div
          className="orb orb-2 top-10 right-[10%] h-72 w-72"
          style={{ "--orb-color": "rgba(217,70,239,0.28)" } as React.CSSProperties}
          aria-hidden
        />
        <div
          className="orb orb-3 bottom-0 left-[15%] h-64 w-64"
          style={{ "--orb-color": "rgba(251,191,36,0.22)" } as React.CSSProperties}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-800/10 bg-white/70 px-3 py-1.5 font-mono text-[0.72rem] font-medium uppercase tracking-wider text-ink-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-paper-300/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>
              Live · 10 Cities Across India
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-ink-950 sm:text-[3.5rem] dark:text-white">
              Essential services,{" "}
              <span className="text-gradient-brand">right where you are.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-ash-600 dark:text-paper-300/70">
              NeighborNet maps free clinics, food banks, water points,
              shelters, and tutoring near you — and lets anyone add a new
              one in under a minute. No login to browse or contribute —
              and every listing shows exactly who can use it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToExplore}
                className="bg-gradient-brand bg-gradient-brand-hover rounded-lg px-6 py-3 text-sm font-medium text-white shadow-[0_0_28px_-6px_rgba(217,70,239,0.55)] transition active:scale-95"
              >
                Explore the map
              </button>
              <button
                onClick={onAdd}
                className="rounded-lg border border-ink-800/15 bg-white/70 px-6 py-3 text-sm font-medium text-ink-800 backdrop-blur transition active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-white hover:bg-white dark:hover:bg-white/10"
              >
                Add a resource
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              return (
                <span
                  key={cat}
                  className="flex items-center gap-1.5 rounded-full border border-ink-800/10 bg-white/70 px-3 py-1.5 font-mono text-[0.75rem] font-medium uppercase tracking-wide text-ash-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-paper-300/80"
                >
                  <Icon size={14} style={{ color: meta.color }} strokeWidth={2.25} />
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-b border-ink-800/8 bg-paper-100/60 dark:border-white/8 dark:bg-ink-900/60"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-3">
          <Step
            icon={<Search size={20} strokeWidth={2.25} />}
            title="Find nearby"
            body="Search, filter by category, or tap Near Me to see what's around you right now."
          />
          <Step
            icon={<Compass size={20} strokeWidth={2.25} />}
            title="See what you need"
            body="Hours, contact info, and one-tap directions for every listing."
          />
          <Step
            icon={<Plus size={20} strokeWidth={2.25} />}
            title="Add & share"
            body="Know a place that should be listed? Add it in under a minute — no account needed."
          />
        </div>
      </section>
    </>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <span className="bg-gradient-brand flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-[0_0_20px_-6px_rgba(217,70,239,0.5)]">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ash-600 dark:text-paper-300/70">
        {body}
      </p>
    </div>
  );
}

export const Hero = memo(HeroImpl);
