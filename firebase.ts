import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// My Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMFKnOK9N4NeV22ERSvyUV77iBtmB96_4",
  authDomain: "chatzuno-d7757.firebaseapp.com",
  projectId: "chatzuno-d7757",
  storageBucket: "chatzuno-d7757.firebasestorage.app",
  messagingSenderId: "394025302172",
  appId: "1:394025302172:web:bda80b62b0226f5d4f5559"
};

// Export a flag so App.tsx knows config is present
export const isConfigured = true;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);