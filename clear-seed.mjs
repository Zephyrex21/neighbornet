// Run this BEFORE re-running seed.mjs if you've already seeded before and
// your seed-data.json has grown since then. This deletes only entries with
// source: "seed" (never touches user-submitted entries with source: "user"),
// so you can safely re-seed without ending up with duplicates.
//
// Usage:
//   node clear-seed.mjs

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// PASTE THE SAME CONFIG YOU PUT IN src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const q = query(collection(db, "resources"), where("source", "==", "seed"));
  const snapshot = await getDocs(q);
  console.log(`Found ${snapshot.size} seed entries to delete...`);

  let count = 0;
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
    count++;
    if (count % 50 === 0) console.log(`  deleted ${count}...`);
  }

  console.log(`Done. Deleted ${count} seed entries. User-submitted entries were left untouched.`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Clearing failed:", err);
  process.exit(1);
});
