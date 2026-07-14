import { describe, it, expect } from "vitest";
import { filterAndSortResources } from "./filterResources";
import type { Resource } from "./resources";
import type { Category } from "./categories";
import type { AccessType } from "./access";
import { Timestamp } from "firebase/firestore";

const now = Timestamp.now();

function makeResource(overrides: Partial<Resource>): Resource {
  return {
    id: "test-id",
    name: "Test Resource",
    category: "health",
    access: "open",
    lat: 28.6139,
    lng: 77.209,
    address: "Test Address, Delhi",
    hours: "9am-5pm",
    source: "seed",
    createdAt: now,
    ...overrides,
  };
}

const sampleResources: Resource[] = [
  makeResource({
    id: "1",
    name: "Community Health Clinic",
    category: "health",
    access: "open",
    lat: 28.6139,
    lng: 77.209,
    address: "Connaught Place, Delhi",
  }),
  makeResource({
    id: "2",
    name: "ESI Dispensary Karol Bagh",
    category: "health",
    access: "insured",
    lat: 28.6519,
    lng: 77.1907,
    address: "Karol Bagh, Delhi",
  }),
  makeResource({
    id: "3",
    name: "Amma Unavagam Canteen",
    category: "food",
    access: "open",
    lat: 13.0827,
    lng: 80.2707,
    address: "Chennai, Tamil Nadu",
  }),
  makeResource({
    id: "4",
    name: "Night Shelter Sector 17",
    category: "shelter",
    access: "open",
    lat: 30.741,
    lng: 76.782,
    address: "Chandigarh",
  }),
];

describe("filterAndSortResources", () => {
  const baseOptions: {
    selectedCategories: Category[];
    selectedAccess: AccessType[];
    search: string;
    userLocation: [number, number] | null;
  } = {
    selectedCategories: ["health", "food", "water", "shelter", "education"],
    selectedAccess: ["open", "insured", "registered"],
    search: "",
    userLocation: null,
  };

  it("returns all resources when no filters are applied", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: [...baseOptions.selectedAccess],
    });
    expect(result).toHaveLength(4);
  });

  it("filters by a single category", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: ["health"],
      selectedAccess: [...baseOptions.selectedAccess],
    });
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.category === "health")).toBe(true);
  });

  it("filters by multiple categories (union, not intersection)", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: ["food", "shelter"],
      selectedAccess: [...baseOptions.selectedAccess],
    });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id).sort()).toEqual(["3", "4"]);
  });

  it("returns empty array when no category is selected", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [],
      selectedAccess: [...baseOptions.selectedAccess],
    });
    expect(result).toHaveLength(0);
  });

  it("filters by access type", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: ["insured"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("treats resources with no access field as 'open' (backward compatibility)", () => {
    const legacyResource = makeResource({ id: "5", access: undefined });
    const result = filterAndSortResources([legacyResource], {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: ["open"],
    });
    expect(result).toHaveLength(1);
  });

  it("combines category and access filters (both must match)", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: ["health"],
      selectedAccess: ["insured"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("searches by name, case-insensitively", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: [...baseOptions.selectedAccess],
      search: "clinic",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("searches by address as well as name", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: [...baseOptions.selectedAccess],
      search: "chennai",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("returns no results for a search term matching nothing", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: [...baseOptions.selectedAccess],
      search: "nonexistent-place-xyz",
    });
    expect(result).toHaveLength(0);
  });

  it("ignores whitespace-only search terms", () => {
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: [...baseOptions.selectedAccess],
      search: "   ",
    });
    expect(result).toHaveLength(4);
  });

  it("sorts by distance from userLocation when provided, nearest first", () => {
    // User is in Delhi — Delhi entries should come before Chennai/Chandigarh.
    const delhiLocation: [number, number] = [28.6139, 77.209];
    const result = filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: [...baseOptions.selectedCategories],
      selectedAccess: [...baseOptions.selectedAccess],
      userLocation: delhiLocation,
    });
    expect(result[0].id).toBe("1"); // exact same coords, distance 0
    // Chennai (~2000km away) should be last since Chandigarh (~250km) and
    // Karol Bagh (~5km) are both closer to the Delhi userLocation.
    expect(result[result.length - 1].id).toBe("3");
  });

  it("does not reorder results when userLocation is null", () => {
    const result = filterAndSortResources(sampleResources, baseOptions);
    expect(result.map((r) => r.id)).toEqual(["1", "2", "3", "4"]);
  });

  it("does not mutate the original resources array", () => {
    const original = [...sampleResources];
    filterAndSortResources(sampleResources, {
      ...baseOptions,
      selectedCategories: ["health"],
      selectedAccess: [...baseOptions.selectedAccess],
      userLocation: [28.6139, 77.209],
    });
    expect(sampleResources).toEqual(original);
  });

  it("combines search, category, access, and distance sort together", () => {
    const result = filterAndSortResources(sampleResources, {
      selectedCategories: ["health"],
      selectedAccess: ["open", "insured"],
      search: "dispensary",
      userLocation: [28.6139, 77.209],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
});
