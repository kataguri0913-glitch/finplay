import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, firebaseReady } from "./firebase";

export async function loadCloudState() {
  if (!firebaseReady || !auth?.currentUser) return null;
  const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveCloudState(state) {
  if (!firebaseReady || !auth?.currentUser) return;
  await setDoc(doc(db, "users", auth.currentUser.uid), state, { merge: true });
}