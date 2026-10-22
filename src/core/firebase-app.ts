import { getAI, GoogleAIBackend } from 'firebase/ai';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

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

// reCAPTCHA Enterprise rejects localhost, so local runs use a debug token instead.
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true;
}

initializeAppCheck(app, {
  // The reCAPTCHA token is a public token and is thus safe here
  provider: new ReCaptchaEnterpriseProvider('6LcQfvstAAAAAF6Nx6U8VDurwxHH6Z3t2q-EvlCS'),
  isTokenAutoRefreshEnabled: true,
});

const analytics = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? getAnalytics(app) : undefined;
const aiBackend = getAI(app, { backend: new GoogleAIBackend(), useLimitedUseAppCheckTokens: true });

export const useFirebaseApp = () => {
  return { app, aiBackend, analytics };
};
