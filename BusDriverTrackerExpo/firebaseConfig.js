// firebaseConfig.js
// Firebase v9 modular SDK (Realtime Database)
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import Constants from "expo-constants";

// Helper to read env var from process.env or Expo config extras
const getEnv = (key) => {
  if (process.env && process.env[key]) return process.env[key];
  // Expo managed apps can provide extras via app.config.js (expoConfig.extra)
  const extras = (Constants && Constants.expoConfig && Constants.expoConfig.extra) || {};
  return extras[key] || null;
};

const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
  databaseURL: getEnv("FIREBASE_DATABASE_URL"),
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID"),
  measurementId: getEnv("FIREBASE_MEASUREMENT_ID"),
};

// Basic runtime check — helpful while developing to give a clearer error
if (!firebaseConfig.databaseURL || !firebaseConfig.projectId) {
  // eslint-disable-next-line no-console
  console.error(
    "FIREBASE CONFIG MISSING: Ensure environment variables or Expo config extras are set (see README).",
    firebaseConfig
  );
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Realtime Database
const db = getDatabase(app);

export { app, db, firebaseConfig };
