import { describe, it, expect } from "vitest";
import { distanceKm, formatDistance } from "./distance";

describe("distanceKm", () => {
  it("returns 0 for identical points", () => {
    expect(distanceKm(28.6139, 77.209, 28.6139, 77.209)).toBeCloseTo(0, 5);
  });

  it("calculates a known real-world distance correctly", () => {
    // Delhi to Mumbai is approximately 1150-1160km as the crow flies.
    const delhi: [number, number] = [28.6139, 77.209];
    const mumbai: [number, number] = [19.076, 72.8777];
    const result = distanceKm(delhi[0], delhi[1], mumbai[0], mumbai[1]);
    expect(result).toBeGreaterThan(1100);
    expect(result).toBeLessThan(1200);
  });

  it("is symmetric — distance A to B equals B to A", () => {
    const a: [number, number] = [28.6139, 77.209];
    const b: [number, number] = [19.076, 72.8777];
    const ab = distanceKm(a[0], a[1], b[0], b[1]);
    const ba = distanceKm(b[0], b[1], a[0], a[1]);
    expect(ab).toBeCloseTo(ba, 10);
  });

  it("handles points across the equator/prime meridian without error", () => {
    const result = distanceKm(-1, -1, 1, 1);
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe("formatDistance", () => {
  it("formats sub-kilometer distances in meters", () => {
    expect(formatDistance(0.5)).toBe("500 m");
    expect(formatDistance(0.001)).toBe("1 m");
  });

  it("formats distances of 1km or more in kilometers with one decimal", () => {
    expect(formatDistance(1)).toBe("1.0 km");
    expect(formatDistance(2.456)).toBe("2.5 km");
    expect(formatDistance(15)).toBe("15.0 km");
  });

  it("rounds meters to the nearest whole number", () => {
    expect(formatDistance(0.1234)).toBe("123 m");
  });
});
