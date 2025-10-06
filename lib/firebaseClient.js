import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAppConfig } from '../utils/config';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function assertClientEnv(cfg) {
  const missing = Object.entries(cfg)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
  }
}

assertClientEnv(firebaseConfig);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);


// Lightweight runtime sanity checks to catch common misconfigurations
try {
  const appCfg = getAppConfig && getAppConfig();
  const expectedAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const baseUrl = appCfg?.baseUrl;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (baseUrl && !origin.startsWith(baseUrl)) {
      // eslint-disable-next-line no-console
      console.warn('[FirebaseConfig] Current origin does not match configured baseUrl:', { origin, baseUrl });
    }
    if (expectedAuthDomain && !expectedAuthDomain.includes(projectId || '')) {
      // eslint-disable-next-line no-console
      console.warn('[FirebaseConfig] Auth domain does not look aligned with projectId:', { expectedAuthDomain, projectId });
    }
  }
} catch {}


