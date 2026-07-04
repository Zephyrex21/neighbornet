// Run this ONCE locally, after filling in src/lib/firebase.ts with your real
// Firebase config, to populate the database with seed data.
//
// Usage:
//   node seed.mjs
//
// Requires: npm install firebase (already a project dependency)

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { readFileSync } from "fs";

// PASTE THE SAME CONFIG YOU PUT IN src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyCln98m3LctV7M4FnYyCkkqLLDfWrxT4eQ",
  authDomain: "neighbournet-32a68.firebaseapp.com",
  projectId: "neighbournet-32a68",
  storageBucket: "neighbournet-32a68.firebasestorage.app",
  messagingSenderId: "1074196798915",
  appId: "1:1074196798915:web:87736d7f440a723f157176",
  measurementId: "G-CZ7DWJGGJG"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = JSON.parse(readFileSync("./seed-data.json", "utf-8"));

async function run() {
  console.log(`Seeding ${seedData.length} resources...`);
  for (const item of seedData) {
    await addDoc(collection(db, "resources"), {
      ...item,
      source: "seed",
      createdAt: Timestamp.now(),
    });
    console.log(`  added: ${item.name}`);
  }
  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
