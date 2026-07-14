// Geocodes every entry in seed-data.json against its real street address,
// using OpenStreetMap's free Nominatim API, and produces a reviewable diff
// instead of blindly overwriting coordinates.
//
// WHY THIS EXISTS: the original seed-data.json coordinates were hand-
// estimated at the neighborhood level (accurate enough for a demo map, but
// not accurate enough for someone actually navigating to a pin). This
// script geocodes the real `address` field for each entry and flags any
// large discrepancies for manual review, rather than assuming the geocoder
// is always right — some of the original addresses are vague enough
// ("Bathinda, Punjab") that a city-center geocode could actually be LESS
// useful than the existing neighborhood-level estimate.
//
// This must run on YOUR machine, not in a sandboxed environment — Nominatim
// is a public rate-limited service (1 request/second, per their usage
// policy) and isn't reachable from restricted network environments.
//
// Usage:
//   node geocode-audit.mjs
//
// Takes roughly 15-20 minutes for 744 entries due to the mandatory 1 req/sec
// rate limit — this is intentional and required by Nominatim's usage policy,
// do not remove the delay or you risk your IP getting blocked.
//
// Output:
//   geocode-report.json  — every entry with old vs new coordinates, distance
//                           moved in km, and a flag for entries that moved
//                           far enough to warrant a manual look
//   seed-data.geocoded.json — the full dataset with geocoded coordinates
//                           applied, ready to review and rename to
//                           seed-data.json if you're happy with it
//
// This script does NOT modify seed-data.json directly — review the report
// first, especially entries flagged "LARGE_MOVE", since those are the ones
// most likely to be either a real accuracy fix or a bad geocode match.

import { readFileSync, writeFileSync } from "fs";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const RATE_LIMIT_MS = 1100; // Nominatim policy: max 1 req/sec, +100ms buffer
const LARGE_MOVE_KM = 2; // flag anything that moved more than this for review

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocode(address) {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=in`;
  const res = await fetch(url, {
    headers: {
      // Nominatim requires a real, descriptive User-Agent identifying the
      // application — requests without one get blocked.
      "User-Agent": "NeighborNet-GeocodeAudit/1.0 (portfolio project, one-time batch script)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const entries = JSON.parse(readFileSync("./seed-data.json", "utf-8"));
  console.log(`Geocoding ${entries.length} entries against Nominatim...`);
  console.log(`Estimated time: ~${Math.ceil((entries.length * RATE_LIMIT_MS) / 60000)} minutes\n`);

  const report = [];
  const geocoded = [];
  let matched = 0;
  let noMatch = 0;
  let flagged = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const fullQuery = `${entry.address}, India`;

    try {
      const result = await geocode(fullQuery);

      if (!result) {
        noMatch++;
        report.push({
          name: entry.name,
          address: entry.address,
          status: "NO_MATCH",
          original: { lat: entry.lat, lng: entry.lng },
        });
        geocoded.push(entry); // keep original coordinates
      } else {
        const movedKm = haversineKm(entry.lat, entry.lng, result.lat, result.lng);
        const isLargeMove = movedKm > LARGE_MOVE_KM;
        if (isLargeMove) flagged++;
        matched++;

        report.push({
          name: entry.name,
          address: entry.address,
          status: isLargeMove ? "LARGE_MOVE" : "OK",
          original: { lat: entry.lat, lng: entry.lng },
          geocoded: { lat: result.lat, lng: result.lng },
          movedKm: Math.round(movedKm * 100) / 100,
        });

        geocoded.push({ ...entry, lat: result.lat, lng: result.lng });
      }
    } catch (err) {
      noMatch++;
      report.push({
        name: entry.name,
        address: entry.address,
        status: "ERROR",
        error: String(err),
        original: { lat: entry.lat, lng: entry.lng },
      });
      geocoded.push(entry);
    }

    if ((i + 1) % 25 === 0 || i === entries.length - 1) {
      console.log(`  ${i + 1}/${entries.length} — matched: ${matched}, no match: ${noMatch}, flagged for review: ${flagged}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  writeFileSync("./geocode-report.json", JSON.stringify(report, null, 2));
  writeFileSync("./seed-data.geocoded.json", JSON.stringify(geocoded, null, 2));

  console.log(`\nDone.`);
  console.log(`  Matched: ${matched}`);
  console.log(`  No match (kept original coords): ${noMatch}`);
  console.log(`  Flagged for manual review (moved >${LARGE_MOVE_KM}km): ${flagged}`);
  console.log(`\nReview geocode-report.json, especially LARGE_MOVE entries.`);
  console.log(`If you're happy with the results, replace seed-data.json with`);
  console.log(`seed-data.geocoded.json and re-run: node clear-seed.mjs && node seed.mjs`);
}

run().catch((err) => {
  console.error("Geocoding audit failed:", err);
  process.exit(1);
});
