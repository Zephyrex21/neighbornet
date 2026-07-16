<div align="center">

# NeighborNet

**A crowdsourced map for finding free and low-cost essential services across India.**

No login required to browse or contribute.

[Live App](https://neighbornet-ten.vercel.app/) · [Report an Issue](https://github.com/Zephyrex21/neighbornet/issues)

</div>

---

## About

NeighborNet maps essential services that are often hard to discover — free clinics, community kitchens, water points, night shelters, and public libraries — and lets anyone add a new one in under a minute.

The dataset includes **744 verified resources across 10 major Indian cities**, sourced from official government directories (municipal health departments, shelter boards, ESI Corporation records) rather than generic listings. Every resource is tagged by who can actually use it — open to all, insured workers only, or registered members — so the map stays honest about access, not just presence.

## Features

- Interactive map with clustered markers, plus a searchable, virtualized list view
- Filter by category (health, food, water, shelter, education) and by access type
- "Near me" geolocation, with results sorted by distance
- Add a new resource in under a minute — no account required
- Real-time updates — new listings appear for everyone instantly
- Light and dark themes, including theme-aware map tiles
- A working feedback loop — report outdated listings directly from the app

## Tech Stack

| | |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Map** | Leaflet, react-leaflet, OpenStreetMap / CARTO tiles |
| **Backend** | Firebase Firestore (real-time, no custom server) |
| **Testing** | Vitest, React Testing Library |
| **CI** | GitHub Actions |
| **Hosting** | Vercel |

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

Add your Firebase web app config to `src/lib/firebase.ts`:

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

The seed scripts use the Firebase **Admin SDK**, which authenticates via a service account key rather than the public client config — this is what allows them to bypass the security rules that (correctly) block public writes from claiming `source: "seed"`.

1. Firebase Console → **Project settings → Service accounts → Generate new private key**
2. Save the downloaded file as `serviceAccountKey.json` in the project root (already in `.gitignore` — this is a real credential, never commit it)
3. Run:

```bash
node seed.mjs
```

If re-seeding after the data has changed, clear old seed entries first to avoid duplicates (this only removes `source: "seed"` entries — anything a real user submitted is left untouched):

```bash
node clear-seed.mjs
node seed.mjs
```

### Deploy Firestore security rules

Copy the contents of `firestore.rules` into **Firebase Console → Firestore Database → Rules → Publish**. This allows public read and tightly validated create access, while blocking all public updates and deletes.

### Run tests

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

57 tests across pure logic (filtering, sorting, rate limiting, distance calculation) and integration flows (resource submission, including abuse-prevention paths). CI runs type-check, lint, test, and build on every push via `.github/workflows/ci.yml`.

## Project Structure

```
src/
  components/         UI components (map, list, filters, forms, error boundary)
  hooks/              Data fetching, geolocation, theme, debouncing
  lib/                Firestore access, filtering logic, category/access types
  test/               Test setup
seed-data.json        Verified resource dataset
seed.mjs              Database seed script (Admin SDK)
clear-seed.mjs        Safely clears seeded entries before re-seeding (Admin SDK)
geocode-audit.mjs     One-time coordinate accuracy pass against OpenStreetMap
firestore.rules       Firestore security rules
PRODUCTION.md         Detailed log of production-hardening decisions and scope
```

## Data

All seed entries are sourced from public, verifiable records rather than scraped or invented — municipal health directories, government shelter programs, and official library and welfare listings. Coordinates are a mix of neighborhood-level estimates and OpenStreetMap-geocoded positions; see `PRODUCTION.md` for the full sourcing and accuracy notes.

## Production Hardening

Beyond the core app, this project includes a documented pass toward production readiness: an error boundary with recoverable fallback UI, honeypot and rate-limiting abuse prevention, tightened Firestore rules (field allowlisting, coordinate bounds, server-timestamp enforcement), and a real Firestore-backed report system. Full details, including what was deliberately deferred and why, are in [`PRODUCTION.md`](./PRODUCTION.md).

## Contributing

Found an outdated listing? Use the **Report issue** button on any resource card in the app, or open an issue on this repository. Pull requests are welcome.

## License

MIT