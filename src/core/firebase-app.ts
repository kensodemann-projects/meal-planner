import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'kws-meal-planner.firebaseapp.com',
  projectId: 'kws-meal-planner',
  storageBucket: 'kws-meal-planner.firebasestorage.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const app = initializeApp(config);
const analytics = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? getAnalytics(app) : undefined;

if (import.meta.env.DEV || window.location.hostname === 'localhost') {
  const auth = getAuth(app);
  const db = getFirestore(app);
  console.log('Connecting to emulator...');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export const useFirebaseApp = () => {
  return { app, analytics };
};
