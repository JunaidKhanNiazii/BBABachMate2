// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAleu1EqoIgYSOjQ0iMSI9bHRF57o0XcQ",
  authDomain: "comsat-6fe05.firebaseapp.com",
  projectId: "comsat-6fe05",
  storageBucket: "comsat-6fe05.firebasestorage.app",
  messagingSenderId: "686830664980",
  appId: "1:686830664980:web:0ecc3231924bc454b5d601"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

export { db, auth };
export default app;