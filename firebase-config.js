import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3a8CnNFtIGa-Kq847W7Gkfa2OUUpYiKc",
  authDomain: "green-marketplace-44bb2.firebaseapp.com",
  databaseURL: "https://green-marketplace-44bb2-default-rtdb.firebaseio.com",
  projectId: "green-marketplace-44bb2",
  storageBucket: "green-marketplace-44bb2.firebasestorage.app",
  messagingSenderId: "786931806717",
  appId: "1:786931806717:web:369dbe7cceacf5f6c56994",
  measurementId: "G-T4P7ECHP0X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services for use in other files
export {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  addDoc,
  collection,
  onSnapshot,
  updateProfile,
};
