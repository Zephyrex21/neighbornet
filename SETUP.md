# NeighborNet — Setup Instructions

## 1. Firebase config (required before anything works)
1. Firebase console → Project settings → Your apps → Web app → copy the config object.
2. Paste it into **two** places, replacing the `REPLACE_ME` placeholders:
   - `src/lib/firebase.ts`
   - `seed.mjs`
3. In Firebase console → Firestore Database → create database (if not
   already) → start in test mode (we'll lock it down in step 3).

## 2. Run locally
```
npm install
npm run dev
```
Open the local URL. The map should load with an empty state (no pins yet).

## 3. Seed real data (run once)
```
node seed.mjs
```
This adds 187 real essential-service entries across 10 major Indian
cities — Delhi NCR (Delhi, Gurugram, Noida, Ghaziabad, Faridabad),
Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur,
and Lucknow — health, food, water, shelter, education — to Firestore.
Refresh the app — pins should appear.

## 4. Lock down Firestore security rules
Firebase console → Firestore Database → Rules → paste the contents of
`firestore.rules` in this project → Publish.
This allows anyone to read and add resources, but not edit/delete
existing ones (prevents vandalism without needing auth).

## 5. Test the add-resource flow
Click "+ Add resource" in the app, click a spot on the mini-map to pin a
location, fill the form, submit. Confirm it appears live on the main map
without refreshing.

## 6. Deploy to Vercel
```
vercel
```
or connect the GitHub repo to Vercel dashboard. No environment variables
needed since Firebase config is in the client code (this is normal/safe
for Firebase — security is enforced by Firestore rules, not by hiding
the config).

## Notes on seed data
All seed entries are **real organizations** (Mohalla Clinics, Basthi
Dawakhanas, BMC/BBMP/KMC/GHMC/PMC municipal health posts, DUSIB/MCG/BBMP
night shelters, gurudwara langars, Amma Unavagam canteens, public
libraries, blood banks, etc.), sourced via web search across official
government directories and verified listings. Coordinates are placed at
the correct neighborhood/area level; a few are approximate since exact
building-level geocoding wasn't available without a paid geocoding API.
Good enough for a demo — if you want to tighten any pin's exact position
later, just open it in the app's "Add resource" map picker to see where
it landed and nudge as needed, or edit `seed-data.json` directly and
re-seed.
