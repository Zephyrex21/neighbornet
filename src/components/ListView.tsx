import type { Resource } from "../lib/resources";
import { ResourceCard } from "./ResourceCard";
import { distanceKm as calcDistance } from "../lib/distance";

export function ListView({
  resources,
  userLocation,
}: {
  resources: Resource[];
  userLocation: [number, number] | null;
}) {
  if (resources.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-paper-100 p-8 text-center dark:bg-ink-900">
        <div>
          <p className="font-display text-lg text-ink-950 dark:text-white">No resources found</p>
          <p className="mt-1 text-sm text-ash-500 dark:text-paper-300/50">
            Try a different filter or search term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-5 overflow-y-auto h-full content-start bg-paper-100 dark:bg-ink-900">
      {resources.map((r) => (
        <ResourceCard
          key={r.id}
          resource={r}
          distanceKm={
            userLocation
              ? calcDistance(userLocation[0], userLocation[1], r.lat, r.lng)
              : undefined
          }
        />
      ))}
    </div>
  );
}
