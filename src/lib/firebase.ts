import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection silently as required by firebase skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch {
    // Offline or initial connection check, no-op
  }
}
testConnection();

// Check if user is currently signed in via Firebase Auth
export function getCurrentFirebaseAuthUser(): Promise<FirebaseUser | null> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function ensureFirebaseAuth(): Promise<FirebaseUser | null> {
  return getCurrentFirebaseAuthUser();
}


