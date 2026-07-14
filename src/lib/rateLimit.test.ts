import { describe, it, expect, beforeEach } from "vitest";
import { canSubmit, recordSubmission } from "./rateLimit";

const STORAGE_KEY = "neighbornet-submissions";

describe("rate limiting", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("allows submission when no prior history exists", () => {
    expect(canSubmit().allowed).toBe(true);
  });

  it("allows submissions up to the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(canSubmit().allowed).toBe(true);
      recordSubmission();
    }
  });

  it("blocks submission once the limit is exceeded within the window", () => {
    for (let i = 0; i < 5; i++) recordSubmission();
    const result = canSubmit();
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMinutes).toBeGreaterThan(0);
  });

  it("ignores timestamps outside the rate-limit window", () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([oneWeekAgo, oneWeekAgo, oneWeekAgo, oneWeekAgo, oneWeekAgo])
    );
    // All 5 recorded submissions are outside the 1-hour window, so a new
    // submission should still be allowed.
    expect(canSubmit().allowed).toBe(true);
  });

  it("fails open (allows submission) when localStorage contains corrupted data", () => {
    localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(canSubmit().allowed).toBe(true);
  });

  it("fails open when localStorage contains a non-array value", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: "an array" }));
    expect(canSubmit().allowed).toBe(true);
  });

  it("filters out non-numeric entries from corrupted storage instead of crashing", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, "bad", null, Date.now()]));
    expect(() => canSubmit()).not.toThrow();
  });
});
