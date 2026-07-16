// Run this BEFORE re-running seed.mjs if you've already seeded before and
// your seed-data.json has grown/changed since then. This deletes only
// entries with source: "seed" (never touches user-submitted entries with
// source: "user"), so you can safely re-seed without ending up with
// duplicates.
//
// Uses the Firebase Admin SDK — see seed.mjs for setup instructions
// (you need serviceAccountKey.json in this folder).
//
// Usage:
//   node clear-seed.mjs

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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

async function run() {
  const snapshot = await db.collection("resources").where("source", "==", "seed").get();
  console.log(`Found ${snapshot.size} seed entries to delete...`);

  const docs = snapshot.docs;
  const batchSize = 400; // Firestore batch writes cap at 500 operations
  let count = 0;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + batchSize);
    for (const doc of chunk) {
      batch.delete(doc.ref);
      count++;
    }
    await batch.commit();
    console.log(`  deleted ${count}/${docs.length}...`);
  }

  console.log(`Done. Deleted ${count} seed entries. User-submitted entries were left untouched.`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Clearing failed:", err);
  process.exit(1);
});
