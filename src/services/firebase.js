// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Production-ready Firebase configuration using Vite environment variables
// Fallbacks are provided so the build compilation and initial mount will succeed out-of-the-box
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForCompilationPurposeOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ascend-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ascend-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ascend-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (typeof window !== 'undefined') {
  console.log("=== FIREBASE STARTUP DEBUG LOGS ===");
  console.log("VITE_FIREBASE_API_KEY raw preview:", import.meta.env.VITE_FIREBASE_API_KEY ? (import.meta.env.VITE_FIREBASE_API_KEY.slice(0, 6) + "..." + import.meta.env.VITE_FIREBASE_API_KEY.slice(-4)) : "UNDEFINED");
  console.log("VITE_FIREBASE_AUTH_DOMAIN raw:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log("VITE_FIREBASE_PROJECT_ID raw:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  
  const maskedConfig = {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? (firebaseConfig.apiKey.slice(0, 6) + "..." + firebaseConfig.apiKey.slice(-4)) : "MISSING"
  };
  console.log("Final firebaseConfig object:", JSON.stringify(maskedConfig, null, 2));
  console.log("===================================");
}

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId ? getAnalytics(app) : null;

// Providers
export const googleProvider = new GoogleAuthProvider();

export default app;
