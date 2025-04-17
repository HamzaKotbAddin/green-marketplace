import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Firestore collection references
const usersCollection = collection(db, 'users');
const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');
const cartCollection = collection(db, 'carts');
const anonymousCollection = collection(db, 'anonymous');
const userDataCollection = collection(db, 'userData');

// Helper functions for Firestore operations
const createDocument = async (collectionRef, data) => {
  return await addDoc(collectionRef, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
};

const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return await deleteDoc(docRef);
};

// Export Firebase services and helper functions
export { 
  auth, 
  db, 
  storage, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut, 
  doc,
  setDoc,
  getDoc,
  addDoc, 
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  usersCollection,
  productsCollection,
  ordersCollection,
  cartCollection,
  anonymousCollection,
  userDataCollection,
  createDocument,
  updateDocument,
  getDocument,
  deleteDocument
};
