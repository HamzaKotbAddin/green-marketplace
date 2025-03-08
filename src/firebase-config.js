// firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get, child } from "firebase/database";

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
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// Initialize Firestore
const db = getFirestore();

// Initialize Firebase Storage
const storage = getStorage();

// Initialize Realtime Database
const database = getDatabase();

// Firebase Authentication - Sign Up
const handleSignUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up successfully");
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

// Firebase Authentication - Login
const handleLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully");
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Firebase Storage - Image Upload
const handleImageUpload = async (file) => {
  const storageRef = ref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Optionally show progress
    },
    (error) => {
      console.error("Error uploading file: ", error);
    },
    async () => {
      // Get download URL after successful upload
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log('File available at', downloadURL);
      // You can now store this URL in Firestore along with other data
    }
  );
};

// Firestore - Add Product Data
const saveProductData = async (imageURL, rating) => {
  try {
    await addDoc(collection(db, 'products'), {
      imageURL: imageURL,
      rating: rating,
      createdAt: new Date(),
    });
    console.log("Product data saved to Firestore");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Firestore - Fetch Products
const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error getting products:", error);
  }
};

// Firestore - Update Product Data
const updateProductData = async (productId, updatedData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, updatedData);
    console.log("Product data updated");
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

// Realtime Database - Set Data
const setProductDataInRealtimeDB = (productId, productData) => {
  set(dbRef(database, 'products/' + productId), productData)
    .then(() => {
      console.log("Product data saved to Realtime Database");
    })
    .catch((error) => {
      console.error("Error saving product data:", error);
    });
};

// Realtime Database - Fetch Data
const fetchProductDataFromRealtimeDB = (productId) => {
  const productRef = dbRef(database, 'products/' + productId);
  get(productRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

// Realtime Database - Update Data
const updateProductDataInRealtimeDB = (productId, updatedData) => {
  const productRef = dbRef(database, 'products/' + productId);
  set(productRef, updatedData)
    .then(() => {
      console.log("Product data updated in Realtime Database");
    })
    .catch((error) => {
      console.error("Error updating product data:", error);
    });
};

// Export all functions
export {
  auth,
  handleSignUp,
  handleLogin,
  db,
  saveProductData,
  fetchProducts,
  updateProductData,
  storage,
  handleImageUpload,
  database,
  setProductDataInRealtimeDB,
  fetchProductDataFromRealtimeDB,
  updateProductDataInRealtimeDB,
};
