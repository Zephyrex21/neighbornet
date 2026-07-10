import { memo } from "react";
import { Clock, Phone, ArrowRight, Flag } from "lucide-react";
import type { Resource } from "../lib/resources";
import { CATEGORY_META } from "../lib/categories";
import { ACCESS_META } from "../lib/access";
import { formatDistance } from "../lib/distance";

function ResourceCardImpl({
  resource,
  distanceKm,
}: {
  resource: Resource;
  distanceKm?: number;
}) {
  const meta = CATEGORY_META[resource.category];
  const Icon = meta.icon;
  return (
    <div className="group rounded-xl border border-ink-800/10 bg-white p-4 transition hover:border-ink-800/20 hover:shadow-lg hover:shadow-ink-950/5 dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20 dark:hover:shadow-black/20">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${meta.color}16`, color: meta.color }}
          >
            <Icon size={16} strokeWidth={2.25} />
          </span>
          <div>
            <h3 className="font-display text-[1.02rem] font-semibold leading-tight text-ink-950 dark:text-white">
              {resource.name}
            </h3>
            <span
              className="font-mono text-[0.7rem] font-semibold uppercase tracking-wide"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
        </div>
        {distanceKm !== undefined && (
          <span className="shrink-0 rounded-md bg-paper-100 px-2 py-0.5 font-mono text-[0.72rem] font-medium text-ash-600 dark:bg-white/10 dark:text-paper-300/70">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>
      <span
        className="mt-2 inline-block rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold"
        style={{
          color: ACCESS_META[resource.access ?? "open"].color,
          borderColor: `${ACCESS_META[resource.access ?? "open"].color}40`,
        }}
      >
        {ACCESS_META[resource.access ?? "open"].label}
      </span>
      <p className="mt-2.5 text-[0.87rem] leading-snug text-ash-600 dark:text-paper-300/70">
        {resource.address}
      </p>
      {(resource.hours || resource.contact) && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] text-ash-500 dark:text-paper-300/50">
          {resource.hours && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> {resource.hours}
            </span>
          )}
          {resource.contact && (
            <span className="flex items-center gap-1">
              <Phone size={13} /> {resource.contact}
            </span>
          )}
        </div>
      )}
      {resource.description && (
        <p className="mt-2 text-[0.85rem] leading-snug text-ash-600 dark:text-paper-300/60">
          {resource.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${resource.lat},${resource.lng}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-accent-600 transition group-hover:gap-1.5 dark:text-accent-400"
        >
          Get directions <ArrowRight size={14} />
        </a>
        <a
          href={`mailto:venom013524@gmail.com?subject=${encodeURIComponent(
            `Issue with listing: ${resource.name}`
          )}&body=${encodeURIComponent(
            `Please describe what's outdated or incorrect about this listing:\n\n---\n${resource.name}\n${resource.address}`
          )}`}
          className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-ash-500 transition hover:text-ash-600 dark:text-paper-300/40 dark:hover:text-paper-300/70"
          title="Report outdated or incorrect information"
        >
          <Flag size={12} /> Report issue
        </a>
      </div>
    </div>
  );
}

export const ResourceCard = memo(ResourceCardImpl);
