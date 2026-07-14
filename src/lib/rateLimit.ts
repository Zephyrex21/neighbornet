/**
 * Client-side rate limiting for resource submissions.
 *
 * Honest scope: this deters casual/accidental spam (someone mashing submit,
 * or a basic script that doesn't clear localStorage) by tracking submission
 * timestamps in the browser. It is NOT a substitute for server-side
 * enforcement — anyone can clear localStorage or use a different browser
 * and bypass it entirely. Real abuse resistance at production scale needs
 * either Firebase App Check (blocks non-browser/scripted traffic) or a
 * Cloud Function doing server-side velocity checks, both of which require
 * infrastructure beyond a client-only app. See PRODUCTION.md.
 *
 * What this genuinely does provide: a real, working demonstration of the
 * rate-limiting pattern, and a functional deterrent against the most
 * common form of abuse (rapid repeated submissions from one browser).
 */

const STORAGE_KEY = "neighbornet-submissions";
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5;

function getTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function saveTimestamps(timestamps: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail open rather
    // than blocking legitimate submissions over a storage quirk.
  }
}

export function canSubmit(): { allowed: boolean; retryAfterMinutes?: number } {
  const now = Date.now();
  const recent = getTimestamps().filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldestInWindow = Math.min(...recent);
    const retryAfterMs = WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, retryAfterMinutes: Math.ceil(retryAfterMs / 60000) };
  }

  return { allowed: true };
}

export function recordSubmission(): void {
  const now = Date.now();
  const recent = getTimestamps().filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  saveTimestamps(recent);
}
