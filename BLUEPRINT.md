# NeighborNet — Project Blueprint
Ctrl+V Hackathon — theme: "access" (local community & essential services)
Deadline: July 5, 2026, 11:45pm EDT

---

## 1. One-line pitch
A map-and-list app where anyone can find and add nearby essential
services — free clinics, food banks, blood banks, water points, shelters,
free tutoring/education — so access to essential services isn't gated
behind "knowing the right person" or "already having the resource."

## 2. Judging alignment (why this scores well)
- **Impact (30%)** — directly targets access to essential services, the
  exact hackathon theme language. Real-world usable, not just a toy demo.
- **Innovation (25%)** — the "innovation" isn't the map (maps aren't new);
  it's the crowdsourced, category-filtered, hyperlocal essential-services
  layer with zero login friction. Frame this clearly in the submission.
- **Technical Implementation (25%)** — real-time DB, geolocation, map
  rendering, working CRUD. Solid but not overbuilt.
- **UX (10%)** — map/list toggle, one-tap "near me," simple add form.
- **Presentation (10%)** — demo video walks through: search -> view on
  map -> add a resource -> see it appear live.

## 3. Scope decisions (LOCKED — do not add features outside this list)

### In scope (MVP)
1. Map view (Leaflet + OpenStreetMap tiles) with category-colored pins.
2. List view (cards) — toggle-able with map view.
3. Categories: Health, Food, Water, Shelter, Education (fixed enum, 5 only).
4. Filter by category (multi-select chips).
5. Search by name/text.
6. "Near me" — browser geolocation, center map + sort list by distance.
7. Add Resource form: name, category, address/coords (click-on-map to
   pin), hours (free text), contact (free text, optional), description
   (free text, optional). No login — anonymous submissions.
8. Firestore as the DB — real-time listener so added resources appear
   without refresh.
9. Seed data: ~30-40 real Delhi-based resources across all 5 categories,
   sourced via web search, so the demo is never empty.
10. Responsive layout (mobile-friendly, since target users may be on
    phones).

### Explicitly OUT of scope (resist scope creep — do not build)
- User accounts / auth / login
- Editing or deleting others' entries (moderation system)
- Ratings/reviews/trust scores (that's a different idea — CommuTrust)
- Turn-by-turn directions/routing (just show pin + address, link out to
  Google Maps for directions instead)
- Multi-city support (hardcode Delhi as default center; app still works
  anywhere if geolocation permitted, just seed data is Delhi-only)
- Notifications, offline/PWA support, multi-language i18n
- Image uploads for resources (text only, v1)
- Admin dashboard

If it's not on the "In scope" list, it does not get built before
submission, no matter how easy it seems mid-flow. Note it as a "future
work" bullet in the submission instead — judges like seeing a clear
roadmap.

## 4. Tech stack (LOCKED)
- **Frontend:** React 19 + TypeScript + Vite (same as dev-tools-suite —
  reuse familiarity)
- **Styling:** Tailwind CSS
- **Map:** Leaflet.js via `react-leaflet` + OpenStreetMap tile layer
  (free, no API key)
- **DB:** Firebase Firestore (free Spark tier) — client SDK talks to
  Firestore directly from the browser, no custom backend server
- **Geolocation:** Browser Geolocation API (`navigator.geolocation`)
- **Hosting:** Vercel (same as before)
- **No backend server, no Express, no custom API routes.**

## 5. Data model (Firestore)

Collection: `resources`

```ts
type Resource = {
  id: string;                 // Firestore doc id (auto)
  name: string;                // "Community Health Clinic"
  category: "health" | "food" | "water" | "shelter" | "education";
  lat: number;
  lng: number;
  address: string;             // free text, human-readable
  hours: string;                // free text, e.g. "Mon-Sat 9am-5pm"
  contact?: string;             // free text, phone/email, optional
  description?: string;         // free text, optional, ~200 char cap
  source: "seed" | "user";      // so we can visually distinguish/debug
  createdAt: Timestamp;
};
```

No sub-collections, no relations, no auth-linked fields. Keep it flat.

## 6. Firestore security rules (MVP — permissive but bounded)
Public read (anyone can view). Public create with field validation
(reject if required fields missing/wrong type, cap string lengths). No
public update/delete (prevents griefing/vandalism of others' entries —
this is our only "safety" mechanism given no auth, and it's enough for
a hackathon demo).

```
match /resources/{id} {
  allow read: if true;
  allow create: if request.resource.data.name is string
    && request.resource.data.name.size() < 100
    && request.resource.data.category in
       ['health','food','water','shelter','education']
    && request.resource.data.lat is number
    && request.resource.data.lng is number;
  allow update, delete: if false;
}
```

## 7. Page/component structure

```
src/
  main.tsx
  App.tsx                    -- routes (single page app, likely just "/")
  lib/
    firebase.ts               -- Firebase init + Firestore instance
    resources.ts               -- addResource(), subscribeResources()
    distance.ts                -- haversine distance calc for "near me" sort
    categories.ts               -- category enum, colors, icons, labels
  hooks/
    useResources.ts             -- real-time Firestore subscription hook
    useGeolocation.ts            -- wraps navigator.geolocation
  components/
    MapView.tsx                  -- react-leaflet map + pins
    ListView.tsx                  -- card list
    ResourceCard.tsx               -- single card (list + popup reuse)
    CategoryFilter.tsx              -- filter chips
    SearchBar.tsx                    -- text search input
    AddResourceModal.tsx              -- form to add new resource
    ViewToggle.tsx                     -- map/list switch
    Header.tsx                          -- app title, near-me button
  App.tsx ties these together with local state:
    - resources[] (from useResources)
    - filteredResources (derived: category + search + optional distance sort)
    - view: "map" | "list"
    - userLocation (from useGeolocation, optional)
```

State stays local to `App.tsx` and is passed down as props — no need for
Redux/Zustand/Context at this scale. Keep it simple.

## 8. Build order (this is the part that prevents "getting confused")

### Day 1 — get the skeleton alive end-to-end
1. Scaffold Vite + React + TS + Tailwind project.
2. Install & configure `react-leaflet`, `leaflet`, `firebase`.
3. Create Firebase project (Firestore in test-ish mode initially, lock
   down rules later same day).
4. Build `MapView` with 3-4 HARDCODED dummy pins first — confirm map
   renders, tiles load, pins show, popups work. (De-risk the trickiest
   visual piece before wiring data.)
5. Wire `useResources` hook to Firestore, replace hardcoded pins with
   real subscription (still empty DB at this point, that's fine).
6. Build `AddResourceModal` — form -> `addResource()` -> confirm new
   doc appears on map live without refresh. This proves the full loop
   works.
7. Build `ListView` + `ViewToggle` (map ⟷ list).
8. Checkpoint: by end of Day 1, a user can open the app, see pins (even
   if just 1-2 test ones), add a new resource via form, see it appear
   on map/list immediately. This is the "critical path" — everything
   else is enhancement.

### Day 2 — fill it out, make it demo-ready
1. Category filter chips (`CategoryFilter`) + wire to filtered list.
2. Search bar + wire to filtered list.
3. Geolocation "Near me" button — center map, sort list by distance.
4. Lock down Firestore security rules (from section 6).
5. Seed data: gather ~30-40 real Delhi resources (I help research/
   compile this as a JSON/script to bulk-insert into Firestore).
6. Polish: mobile responsiveness pass, empty states, loading states,
   category color/icon consistency, favicon/title.
7. Deploy to Vercel, test the LIVE deployed link end-to-end (not just
   localhost) — do this with enough buffer time in case env vars/
   Firebase config need fixing on Vercel.
8. Record 3-min demo video: problem statement (10s) -> live app walkthrough
   (find near me, filter, add resource, see it appear) (2 min) -> tech
   stack + impact framing (30s) -> future work (20s).
9. Write Devpost submission text (I'll draft, you review/edit).
10. Submit with buffer time before 11:45pm EDT deadline — do not submit
    at the last minute in case Devpost has upload issues.

## 9. Risk list (things that could derail us, and the mitigation)
| Risk | Mitigation |
|---|---|
| Firebase setup/config eats time | Do it FIRST on Day 1, before any UI polish |
| Map looks empty in demo | Seed data locked in as a required Day 1/2 task, not optional |
| Geolocation permission denied in demo | Always have Delhi hardcoded as fallback center |
| Scope creep (adding "just one more feature") | Section 3's locked scope list — check against it before building anything new |
| Vercel deploy breaks at the last minute (env vars) | Deploy early Day 2, not Day 2 night |
| Firestore rules block legitimate writes | Test the add-resource flow against real deployed rules before recording demo |

## 10. Submission framing (for later, not now)
- Emphasize: no login barrier (some people avoid apps requiring
  signup), works for anyone with a phone browser, crowdsourced so it
  scales beyond what any one org could maintain, directly targets
  underserved/informal-access gaps (people who don't know free clinics
  or food banks exist nearby).
- Mention future work: multi-city, offline/PWA support, moderation/
  verification layer, multilingual support — shows judges we know the
  next steps without pretending we built them.

---
**This file is the source of truth for scope. If a build conversation
drifts from this doc, we stop and check against it before continuing.**
