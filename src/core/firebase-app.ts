import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.PROD
    ? 'kws-meal-planner.firebaseapp.com'
    : 'my-daily-planner-development.firebaseapp.com',
  projectId: import.meta.env.PROD ? 'kws-meal-planner' : 'my-daily-planner-development',
  storageBucket: import.meta.env.PROD
    ? 'kws-meal-planner.firebasestorage.com'
    : 'my-daily-planner-development.firebasestorage.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const app = initializeApp(config);
const analytics = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? getAnalytics(app) : undefined;

export const useFirebaseApp = () => {
  return { app, analytics };
};
