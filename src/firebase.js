import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Read from environmental variables with fallback to hardcoded production values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDWtMb_pHcuDz1TXTgl3CscEIGcIEZUJNg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mellow-373c8.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mellow-373c8-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mellow-373c8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mellow-373c8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "238143535872",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:238143535872:web:911d703ff4e463fed1d1e5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MCJ7E646LZ"
};

// Initialize Core Application Context
const app = initializeApp(firebaseConfig);

// Initialize Cloud services with proper environmental boundary guards
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app);

export default app;