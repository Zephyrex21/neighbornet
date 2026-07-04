import { Search, Compass, Plus } from "lucide-react";
import { CATEGORIES, CATEGORY_META } from "../lib/categories";

export function Hero({ onAdd }: { onAdd: () => void }) {
  const scrollToExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section id="top" className="mx-auto max-w-7xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-ink-900/5 px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-wide text-ink-700">
            New Delhi · Community-verified
          </span>
          <h1 className="mt-5 font-display text-[2.6rem] font-medium leading-[1.08] tracking-tight text-ink-950 sm:text-[3.4rem]">
            Essential services,{" "}
            <span className="italic text-ink-700">right where you are.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-ash-600">
            NeighborNet maps free clinics, food banks, water points,
            shelters, and tutoring near you — and lets anyone add a new
            one in under a minute. No login, no gatekeeping.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToExplore}
              className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-ink-800"
            >
              Explore the map
            </button>
            <button
              onClick={onAdd}
              className="rounded-full border border-ink-800/15 bg-white px-6 py-3 text-sm font-medium text-ink-800 shadow-sm transition hover:border-ink-800/30"
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
                className="flex items-center gap-1.5 rounded-full border border-ink-800/10 bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ash-600 shadow-sm"
              >
                <Icon size={14} style={{ color: meta.color }} strokeWidth={2.25} />
                {meta.label}
              </span>
            );
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-ink-800/8 bg-paper-100/60"
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
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-marigold-400">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-medium text-ink-950">
        {title}
      </h3>
      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ash-600">
        {body}
      </p>
    </div>
  );
}
