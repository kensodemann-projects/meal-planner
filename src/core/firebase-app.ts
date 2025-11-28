import { getAI, GoogleAIBackend } from 'firebase/ai';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

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
const aiBackend = getAI(app, { backend: new GoogleAIBackend() });

export const useFirebaseApp = () => {
  return { app, aiBackend, analytics };
};
