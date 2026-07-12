import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Category } from "./categories";
import type { AccessType } from "./access";

export type Resource = {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  address: string;
  hours: string;
  contact?: string;
  description?: string;
  access: AccessType;
  source: "seed" | "user";
  createdAt: Timestamp;
};

export type NewResource = Omit<Resource, "id" | "createdAt">;

const COLLECTION = "resources";

/** Subscribe to live updates of all resources. Returns an unsubscribe fn. */
export function subscribeResources(
  onUpdate: (resources: Resource[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const resources = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Resource)
      );
      onUpdate(resources);
    },
    (error) => {
      // Without this, a Firestore failure (network, rules, quota) leaves
      // the app silently stuck on "Loading resources..." forever.
      console.error("Failed to load resources:", error);
      onError?.(error);
    }
  );
}

export async function addResource(resource: NewResource): Promise<void> {
  // Firestore's addDoc throws if any field value is `undefined` — strip
  // optional fields that weren't provided instead of sending them as undefined.
  const clean = Object.fromEntries(
    Object.entries(resource).filter(([, value]) => value !== undefined)
  );
  await addDoc(collection(db, COLLECTION), {
    ...clean,
    createdAt: Timestamp.now(),
  });
}
