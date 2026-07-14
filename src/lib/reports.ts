import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type NewReport = {
  resourceId: string;
  resourceName: string;
  message: string;
};

const COLLECTION = "reports";

export async function submitReport(report: NewReport): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...report,
    status: "open",
    createdAt: serverTimestamp(),
  });
}
