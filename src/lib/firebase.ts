import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: replace with your real Firebase project config
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
export const db = getFirestore(app);
