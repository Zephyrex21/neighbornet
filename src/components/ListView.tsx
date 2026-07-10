import { forwardRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import type { Resource } from "../lib/resources";
import { ResourceCard } from "./ResourceCard";
import { distanceKm as calcDistance } from "../lib/distance";

const GridList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={style}
      className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {children}
    </div>
  )
);
GridList.displayName = "GridList";

function GridItem({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

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
    <VirtuosoGrid
      style={{ height: "100%" }}
      className="bg-paper-100 dark:bg-ink-900"
      totalCount={resources.length}
      overscan={600}
      components={{ List: GridList, Item: GridItem }}
      itemContent={(index) => {
        const r = resources[index];
        return (
          <ResourceCard
            resource={r}
            distanceKm={
              userLocation
                ? calcDistance(userLocation[0], userLocation[1], r.lat, r.lng)
                : undefined
            }
          />
        );
      }}
    />
  );
}
