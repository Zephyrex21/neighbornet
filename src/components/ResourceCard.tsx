import type { Resource } from "../lib/resources";
import { CATEGORY_META } from "../lib/categories";
import { formatDistance } from "../lib/distance";

export function ResourceCard({
  resource,
  distanceKm,
}: {
  resource: Resource;
  distanceKm?: number;
}) {
  const meta = CATEGORY_META[resource.category];
  return (
    <div className="group rounded-2xl border border-ink-800/10 bg-white p-4 transition-all hover:border-ink-800/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
            style={{ backgroundColor: `${meta.color}1a` }}
          >
            {meta.icon}
          </span>
          <div>
            <h3 className="font-display text-[1.02rem] font-medium leading-tight text-ink-950">
              {resource.name}
            </h3>
            <span
              className="text-[0.72rem] font-semibold uppercase tracking-wide"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
        </div>
        {distanceKm !== undefined && (
          <span className="shrink-0 rounded-full bg-paper-100 px-2 py-0.5 text-[0.72rem] font-medium text-ash-600">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-[0.87rem] leading-snug text-ash-600">
        {resource.address}
      </p>
      {(resource.hours || resource.contact) && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] text-ash-500">
          {resource.hours && <span>🕒 {resource.hours}</span>}
          {resource.contact && <span>📞 {resource.contact}</span>}
        </div>
      )}
      {resource.description && (
        <p className="mt-2 text-[0.85rem] leading-snug text-ash-600">
          {resource.description}
        </p>
      )}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${resource.lat},${resource.lng}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-ink-800 transition group-hover:gap-1.5"
      >
        Get directions <span aria-hidden>→</span>
      </a>
    </div>
  );
}
