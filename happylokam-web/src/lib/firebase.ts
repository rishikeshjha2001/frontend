import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvN6gpY8-mm8WiszgGpCzT_8Ann937kgM",
  authDomain: "happylokam-1c6f2.firebaseapp.com",
  projectId: "happylokam-1c6f2",
  storageBucket: "happylokam-1c6f2.firebasestorage.app",
  messagingSenderId: "177584215248",
  appId: "1:177584215248:web:fdcaf6436073931f413ad5",
  measurementId: "G-JG060192RK"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
