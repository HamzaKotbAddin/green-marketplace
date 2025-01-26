// firebase.js

// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAuth } from "firebase/auth"; // Authentication

// Firebase config (replace with your own config details)
const firebaseConfig = {
  apiKey: "AIzaSyB3a8CnNFtIGa-Kq847W7Gkfa2OUUpYiKc",
  authDomain: "green-marketplace-44bb2.firebaseapp.com",
  projectId: "green-marketplace-44bb2",
  storageBucket: "green-marketplace-44bb2.firebasestorage.app",
  messagingSenderId: "786931806717",
  appId: "1:786931806717:web:fe66fd48fc72be06c56994",
  measurementId: "G-FN57206NR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app); // For database
const auth = getAuth(app);     // For authentication

// Export db and auth for use in your app
export { db, auth };
