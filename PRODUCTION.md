# Production Hardening — Status

This documents what was built in the "9/10 production" pass, what was
deliberately deferred, and why — so the scope decisions are explicit
rather than silently missing.

**Context:** this is a portfolio project, not a live launch. The goal was
to build genuinely correct, demonstrable versions of real production
patterns — not to gold-plate infrastructure (e.g. paid Cloud Functions)
that only matters at real scale with real attackers.

---

## Phase 1 — Done

### Error Boundary
`src/components/ErrorBoundary.tsx`, wired into `main.tsx`. Catches
render-time crashes anywhere in the tree and shows a recoverable fallback
UI instead of a blank white screen. Logs to console; the
`componentDidCatch` method is the integration point for a real error
monitoring service (Sentry, etc.) if this were ever actually deployed —
see "Deferred" below.

**Known limitation (React's, not this implementation's):** Error
Boundaries only catch errors during render/lifecycle. They do NOT catch
errors inside event handlers or async code — those need their own
try/catch, which the app already has (e.g. `AddResourceModal`'s submit
handler).

### Abuse prevention
Three layers, all client-side/rules-based (see "Deferred" for what a real
launch would add on top):

1. **Honeypot field** (`AddResourceModal.tsx`) — a hidden input real users
   never see or reach via keyboard nav, but naive bots that fill every
   field on a form will trigger it. Submissions through it silently no-op.
2. **Client-side rate limiting** (`src/lib/rateLimit.ts`) — tracks
   submission timestamps in localStorage, caps at 5 submissions/hour per
   browser. Documented honestly in the file itself: this deters casual
   abuse, it does not stop a determined attacker (clearing localStorage
   bypasses it entirely).
3. **Tightened Firestore rules** (`firestore.rules`) — this is the layer
   that actually matters, since rules run server-side and can't be
   bypassed by the client. Added: field allowlisting (`hasOnly`, blocks
   arbitrary data injection), lat/lng bounds validation, string length
   caps on every field, and critically — `source` can now only ever be
   `'user'` on a public write (previously nothing stopped a malicious
   client from submitting `source: 'seed'` to make spam look like
   verified data), and `createdAt` must match the server's own clock
   (`request.time`), which required switching the client from
   `Timestamp.now()` to Firestore's `serverTimestamp()` sentinel — a
   client-set timestamp can never satisfy that check, so both sides of
   this had to change together.

---

## Phase 2 — Done

### Real feedback loop (replaces the mailto "Report issue" link)
`src/lib/reports.ts` + `src/components/ReportIssueModal.tsx`. Reports
now land in a proper `reports` Firestore collection (status, message,
which resource, server timestamp) instead of an email that only reaches
one inbox and isn't queryable, sortable, or actionable at any scale.

There is **no admin view to read reports yet** — the Firestore rule for
`reports` is `allow read: if false`, meaning even the app itself can't
currently list them back. This is intentional, not an oversight: building
a "read all reports" view without real authentication would mean either
leaving it genuinely public (bad — reports could contain information you
don't want publicly readable) or faking security with an obscure URL
(worse — false sense of protection). The right fix is Phase 4's auth
work; until then, reports are being captured correctly and durably, just
not yet surfaced anywhere. You can read them manually via the Firebase
Console in the meantime.

### Geocoding accuracy
`geocode-audit.mjs` — a one-time batch script using OpenStreetMap's free
Nominatim geocoder. **You need to run this yourself** (see below); it
can't run from a sandboxed environment since Nominatim isn't reachable
from restricted networks, same reason `seed.mjs` has always been a script
you run locally.

It does not blindly overwrite coordinates — it produces a report showing
old vs. new coordinates and how far each one moved, flagging anything
that shifted more than 2km for manual review before you commit to it.
Some of the original addresses are vague enough ("Bathinda, Punjab") that
a city-center geocode could be less useful than the existing
neighborhood-level estimate, so this is designed to be reviewed, not
auto-applied.

**To run it:**
```bash
node geocode-audit.mjs
```
Takes ~15-20 minutes for 744 entries (Nominatim's usage policy requires
max 1 request/second — the script enforces this, don't remove the delay
or you risk your IP getting rate-limited/blocked by their service).

Then review `geocode-report.json`, especially entries marked
`LARGE_MOVE`. If you're happy with the results:
```bash
cp seed-data.geocoded.json seed-data.json
node clear-seed.mjs
node seed.mjs
```

---

## Phase 3 — Done

### Tests
Vitest + React Testing Library. 57 tests across 11 files, all genuinely
run and passing (not just written — verified end-to-end including the
exact sequence CI runs).

- **Pure logic, thoroughly covered**: `distance.ts`, `rateLimit.ts`,
  `categories.ts`, `access.ts` metadata completeness, and
  `filterResources.ts` (15 tests alone — this is the core search/filter
  behavior of the entire app, previously untested since it lived inline
  inside `App.tsx`'s `useMemo`. It's now extracted into its own pure,
  testable module as part of this work, which is a real architecture
  improvement independent of the tests themselves).
- **Integration tests on the two highest-risk flows** you named:
  submitting a resource (`AddResourceModal.test.tsx` — covers validation,
  successful submission, the honeypot silently no-opping, rate-limit
  blocking with the correct error, and failure handling) and
  filtering/search (`filterResources.test.ts`).
- **Component tests** for the simpler presentational pieces
  (`CategoryFilter`, `AccessFilter`, `SearchBar`, `ViewToggle`) and the
  new `ErrorBoundary` (crash → fallback → recovery).

**Honest scope note:** this is not 100% coverage, and I didn't chase that
number. `MapView` and `ListView` aren't unit tested — they're thin
wrappers around Leaflet and react-virtuoso respectively, and testing
"does the third-party library render" isn't valuable; the logic that
actually matters (filtering, sorting, submission validation, rate
limiting) is what's covered. Run `npm run test:coverage` for the full
per-file breakdown.

**A real bug found by writing these tests, not by inspection:** the
production build (`tsc -b`, what `npm run build` and CI both actually
run) was failing once test files existed, because they landed in the same
TypeScript project as the app code without vitest's types configured,
and `vite.config.ts`'s `test` key wasn't recognized by the `vite`-sourced
`defineConfig`. Fixed by giving test files their own TypeScript project
(`tsconfig.test.json`, excluded from the app's production build) and
switching to `defineConfig` from `vitest/config`. This is exactly the
kind of gap that "add tests" catches and a passing `tsc --noEmit` (as
opposed to the real `tsc -b` build command) can silently miss.

### CI
`.github/workflows/ci.yml` — runs on every push and PR to `main`: install,
type-check, lint, test, build, in that order, any failure blocks. This is
the actual sequence verified locally above, not a guess at what CI
"should" do.

---

## Correction — seed.mjs / clear-seed.mjs now actually use the Admin SDK

The original Phase 1 writeup claimed the seed script "bypasses rules via
Admin SDK" as if that were already true. It wasn't — `seed.mjs` and
`clear-seed.mjs` had always used the regular client SDK, the same one the
public website uses. That meant they were bound by the same security
rules as any visitor, including the new `source == 'user'` requirement
added in Phase 1 (which exists specifically to stop a public client from
faking `source: 'seed'`). The seed script needs to write `source: 'seed'`
— so it was blocking its own writes with permission-denied errors.

Fixed by actually switching both scripts to `firebase-admin`, which
authenticates via a service account key and genuinely bypasses security
rules, rather than trying to loosen the rules (which would have reopened
the exact vulnerability they exist to close). This requires a one-time
setup step — see the instructions at the top of `seed.mjs`. The service
account key file is a real credential and is in `.gitignore`; it must
never be committed.

---

## Deferred — Phase 4 (monitoring + admin auth)

## Explicitly not built, and why

- **Firebase App Check** — would meaningfully strengthen abuse prevention
  by blocking non-browser/scripted traffic at the infrastructure level,
  but requires registering a reCAPTCHA site key tied to your actual
  deployed domain, which is domain-specific setup only you can do (not
  something buildable from here). The client-side scaffolding is
  compatible with adding it later.
- **Server-side rate limiting via Cloud Functions** — the only way to make
  rate limiting unbypassable, but Cloud Functions requires Firebase's
  Blaze (pay-as-you-go) billing plan even for free-tier usage volumes,
  which is a real cost/commitment decision that shouldn't be made
  silently on your behalf for a portfolio project.
