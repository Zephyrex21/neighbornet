# Devpost Submission Draft — NeighborNet

Copy-paste into Devpost fields, edit placeholders in [brackets].

---

## Project name
NeighborNet

## Tagline / short description (one-liner)
A crowdsourced map to find free clinics, food banks, water points,
shelters, and tutoring near you — no login, no gatekeeping.

## Inspiration
Millions of people live within walking distance of a free clinic, food
bank, or shelter and never know it exists — because that information is
scattered across government PDFs, NGO websites, and word of mouth.
Access to essential services shouldn't depend on who you happen to know
or which website you happen to find. We built NeighborNet to put that
information in one place, and let the community keep it growing.

## What it does
NeighborNet is a map-and-list app where anyone can find — and add —
nearby essential services across five categories: Health, Food, Water,
Shelter, and Education. Users can:
- View services on an interactive map or as a searchable list
- Filter by category
- Use "Near me" to center the map and sort by distance
- Add a new resource in under a minute — pin a location, fill a short
  form, done — no account required
- See new listings appear live for everyone, instantly

The app launches pre-seeded with ~29 real essential services in Delhi —
Aam Aadmi Mohalla Clinics, DUSIB night shelters, Delhi Public Library
branches, Indian Red Cross blood banks, and verified NGOs — sourced from
public records, not fabricated, so the map is genuinely useful from day
one, not an empty shell waiting for users.

## How we built it
- **Frontend:** React + TypeScript + Vite, styled with Tailwind CSS
- **Map:** Leaflet.js with OpenStreetMap tiles (free, no API key)
- **Backend:** Firebase Firestore — real-time listeners mean new
  resources appear for every user instantly, with no custom server
- **Geolocation:** Browser Geolocation API for "Near me"
- **Security:** Firestore rules allow public read/create with field
  validation, but block edit/delete — a lightweight safety net against
  vandalism without requiring user accounts
- **Hosting:** Vercel

We deliberately kept the stack server-less and auth-less: every barrier
we removed for the *builder* (no backend to maintain) mirrors the
barrier we removed for the *user* (no signup to add a resource).

## Challenges we ran into
- Sourcing real, verifiable data instead of placeholder/fake entries —
  we researched actual Delhi government programs (Mohalla Clinics, DUSIB
  shelters, Delhi Jal Board water ATMs) and public directories rather
  than inventing organizations, which took real research time but made
  the demo honest.
- Balancing zero-friction contribution (no login) against spam/abuse
  risk — solved with Firestore rules that allow anyone to add but no one
  to edit or delete, plus field validation at the database level.
- Keeping scope tight under hackathon time pressure — we explicitly
  cut ratings, moderation dashboards, multi-city support, and offline
  mode from v1 to ship a working, polished core loop.

## Accomplishments we're proud of
- A fully working add → live-update loop with zero backend code
- Real, verified seed data instead of a fake/empty demo
- A clean, distinct visual identity rather than a generic template look

## What we learned
[Personalize this — e.g., "How much Firestore's real-time listeners
simplify what would otherwise be a websocket/polling problem," or
"How scattered public-service information actually is, even when it's
technically public."]

## What's next for NeighborNet
- Offline/PWA support for low-connectivity areas
- Multi-language support (Hindi, and beyond Delhi to other cities)
- A lightweight community-verification layer so trusted contributors can
  confirm listings stay accurate over time
- Expand beyond Delhi to any city, community-seeded

## Built with
react, typescript, vite, tailwindcss, firebase, firestore, leaflet,
openstreetmap, vercel

## Try it out
- Live app: [your Vercel URL]
- GitHub: [your GitHub repo URL]

---

## Submission checklist (Devpost)
- [ ] Project name + tagline
- [ ] Full description (sections above)
- [ ] Demo video uploaded (YouTube/Vimeo unlisted link works) — see
      DEMO_VIDEO_SCRIPT.md
- [ ] Technologies used tags added
- [ ] Screenshots (optional but recommended — grab 2-3: map view,
      list view, add-resource modal)
- [ ] Project links (GitHub + live Vercel URL)
- [ ] Submitted with buffer time before July 5, 11:45pm EDT — don't wait
      until the last 15 minutes in case of upload issues
