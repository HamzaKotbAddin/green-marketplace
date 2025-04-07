// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Configuration (from environment variables)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Collection reference for products
const productsCollection = collection(db, "products");

// Firestore CRUD operations
const firestore = {
    // Create a document
    createDoc: async (collectionRef, data) => {
        const docRef = await addDoc(collectionRef, {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return docRef.id;
    },

    // Update a document
    updateDoc: async (collectionName, docId, data) => {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date(),
        });
    },

    // Get a single document
    getDoc: async (collectionName, docId) => {
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    // Delete a document
    deleteDoc: async (collectionName, docId) => {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    },

    // Get all documents in a collection
    getCollection: async (collectionRef) => {
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
};

// Export Firebase services and utilities
export { app, auth, db, storage, productsCollection, firestore };