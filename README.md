# NeighborNet

A crowdsourced map for finding free and low-cost essential services — health, food, water, shelter, and education — across India. No login required to browse or contribute.

**Live app:** [neighbornet-ten.vercel.app](https://neighbornet-ten.vercel.app/)

---

## About

NeighborNet maps essential services that are often hard to discover — free clinics, community kitchens, water points, night shelters, and public libraries — and lets anyone add a new one in under a minute. The dataset currently includes 744 verified resources across 10 major Indian cities, sourced from official government directories rather than generic listings.

Every resource is tagged by who can actually use it — open to all, insured workers only, or registered members — so the map stays honest about access, not just presence.

## Features

- Interactive map with clustered markers, plus a searchable list view
- Filter by category (health, food, water, shelter, education) and by access type
- "Near me" geolocation, with results sorted by distance
- Add a new resource in under a minute — no account required
- Real-time updates — new listings appear for everyone instantly
- Light and dark themes, including theme-aware map tiles
- Built for performance at scale: marker clustering, list virtualization, and code-split bundles

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Map:** Leaflet, react-leaflet, OpenStreetMap / CARTO tiles
- **Backend:** Firebase Firestore (real-time, no custom server)
- **Hosting:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore enabled

### Installation

```bash
git clone https://github.com/Zephyrex21/neighbornet.git
cd neighbornet
npm install
```

### Configuration

Add your Firebase project config to `src/lib/firebase.ts` and `seed.mjs`:

```ts
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### Run locally

```bash
npm run dev
```

### Seed the database

```bash
node seed.mjs
```

Loads the full dataset of verified resources into Firestore. If re-seeding after a data update, run `node clear-seed.mjs` first to avoid duplicates — it only removes previously seeded entries and leaves user-submitted ones untouched.

### Deploy Firestore security rules

Copy the contents of `firestore.rules` into Firebase Console → Firestore Database → Rules. This allows public read and validated create access, while blocking edit and delete — no login required, no open door for vandalism.

## Project Structure

```
src/
  components/    UI components (map, list, filters, forms)
  hooks/         Data fetching, geolocation, theme, debouncing
  lib/           Firestore access, types, category/access definitions
seed-data.json   Verified resource dataset
seed.mjs         One-time database seed script
clear-seed.mjs   Safely clears seeded entries before re-seeding
firestore.rules  Firestore security rules
```

## Data

All seed entries are sourced from public, verifiable records — municipal health directories, government shelter programs, and official library and welfare listings — rather than scraped or invented. See `SETUP.md` for sourcing notes and known limitations.

## Contributing

Found an outdated listing? Use the "Report issue" link on any resource card, or open an issue on this repository. Pull requests are welcome.

## License

MIT