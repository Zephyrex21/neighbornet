// Run this to populate (or re-populate) the database with seed data.
//
// This uses the Firebase ADMIN SDK, not the regular client SDK — it
// authenticates as a trusted server via a service account key, which
// genuinely bypasses Firestore security rules. This matters because the
// security rules require source == 'user' on any public client write
// (so a malicious visitor can't fake source: 'seed' to make spam look
// like verified data) — which means the regular client SDK can never be
// used to write source: 'seed' entries, seed or not. The Admin SDK is
// the only correct way to do this.
//
// Setup (one-time):
//   1. Firebase Console -> Project settings (gear icon) -> Service accounts
//   2. Click "Generate new private key" -> downloads a JSON file
//   3. Save it in this project folder as serviceAccountKey.json
//      (already in .gitignore — never commit this file, it's a real credential)
//
// Usage:
//   node seed.mjs

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));
} catch {
  console.error(
    "Couldn't find serviceAccountKey.json in this folder.\n\n" +
    "Get one from: Firebase Console -> Project settings -> Service accounts\n" +
    "-> Generate new private key -> save the downloaded file here as\n" +
    "serviceAccountKey.json (it's already in .gitignore, never commit it)."
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const seedData = JSON.parse(readFileSync("./seed-data.json", "utf-8"));

async function run() {
  console.log(`Seeding ${seedData.length} resources...`);
  const batchSize = 400; // Firestore batch writes cap at 500 operations
  for (let i = 0; i < seedData.length; i += batchSize) {
    const batch = db.batch();
    const chunk = seedData.slice(i, i + batchSize);
    for (const item of chunk) {
      const ref = db.collection("resources").doc();
      batch.set(ref, {
        ...item,
        source: "seed",
        createdAt: Timestamp.now(),
      });
    }
    await batch.commit();
    console.log(`  ${Math.min(i + batchSize, seedData.length)}/${seedData.length} written...`);
  }
  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
