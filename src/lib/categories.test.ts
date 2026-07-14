import { describe, it, expect } from "vitest";
import { CATEGORIES, CATEGORY_META } from "./categories";

describe("category metadata", () => {
  it("has metadata defined for every category", () => {
    for (const category of CATEGORIES) {
      expect(CATEGORY_META[category]).toBeDefined();
    }
  });

  it("every category has a non-empty label", () => {
    for (const category of CATEGORIES) {
      expect(CATEGORY_META[category].label.length).toBeGreaterThan(0);
    }
  });

  it("every category has a valid hex color", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const category of CATEGORIES) {
      expect(CATEGORY_META[category].color).toMatch(hexPattern);
    }
  });

  it("every category has a distinct color (no two categories look identical on the map)", () => {
    const colors = CATEGORIES.map((c) => CATEGORY_META[c].color);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it("every category has an icon component", () => {
    for (const category of CATEGORIES) {
      expect(CATEGORY_META[category].icon).toBeDefined();
    }
  });
});
