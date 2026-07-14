import type { Resource } from "./resources";
import type { Category } from "./categories";
import type { AccessType } from "./access";
import { distanceKm } from "./distance";

export function filterAndSortResources(
  resources: Resource[],
  options: {
    selectedCategories: Category[];
    selectedAccess: AccessType[];
    search: string;
    userLocation: [number, number] | null;
  }
): Resource[] {
  const { selectedCategories, selectedAccess, search, userLocation } = options;

  let result = resources.filter(
    (r) =>
      selectedCategories.includes(r.category) &&
      selectedAccess.includes(r.access ?? "open")
  );

  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
    );
  }

  if (userLocation) {
    // Compute each resource's distance once (O(n)) instead of inside the
    // sort comparator, which would recompute it on every comparison
    // (O(n log n) — the same resource's distance calculated many times
    // over during a single sort).
    result = result
      .map((r) => ({
        r,
        d: distanceKm(userLocation[0], userLocation[1], r.lat, r.lng),
      }))
      .sort((a, b) => a.d - b.d)
      .map(({ r }) => r);
  }

  return result;
}
