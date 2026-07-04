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
  source: "seed" | "user";
  createdAt: Timestamp;
};

export type NewResource = Omit<Resource, "id" | "createdAt">;

const COLLECTION = "resources";

/** Subscribe to live updates of all resources. Returns an unsubscribe fn. */
export function subscribeResources(
  onUpdate: (resources: Resource[]) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const resources = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Resource)
    );
    onUpdate(resources);
  });
}

export async function addResource(resource: NewResource): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...resource,
    createdAt: Timestamp.now(),
  });
}
