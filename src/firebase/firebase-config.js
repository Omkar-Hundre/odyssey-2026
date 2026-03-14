// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ Replace with your Firebase project config from:
// Firebase Console → Project Settings → Your Apps → Web App
const firebaseConfig = {
  apiKey: "AIzaSyAR5_Ex-ucIDgLxtkR7RlcX5gKenO8aX90",
  authDomain: "odyssey-2026.firebaseapp.com",
  projectId: "odyssey-2026",
  storageBucket: "odyssey-2026.firebasestorage.app",
  messagingSenderId: "591770249836",
  appId: "1:591770249836:web:f9be76fcc3eedda1c60649"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
