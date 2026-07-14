import { describe, it, expect } from "vitest";
import { ACCESS_TYPES, ACCESS_META } from "./access";

describe("access-type metadata", () => {
  it("has metadata defined for every access type", () => {
    for (const type of ACCESS_TYPES) {
      expect(ACCESS_META[type]).toBeDefined();
    }
  });

  it("every access type has a non-empty label and description", () => {
    for (const type of ACCESS_TYPES) {
      expect(ACCESS_META[type].label.length).toBeGreaterThan(0);
      expect(ACCESS_META[type].description.length).toBeGreaterThan(0);
    }
  });

  it("every access type has a valid hex color", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const type of ACCESS_TYPES) {
      expect(ACCESS_META[type].color).toMatch(hexPattern);
    }
  });

  it("includes 'open' as a valid access type (the default/fallback value used elsewhere)", () => {
    expect(ACCESS_TYPES).toContain("open");
  });
});
