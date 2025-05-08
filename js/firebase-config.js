// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDutX_psBuAFVHqBMb33bYbU-gVfuGOHm4",
  authDomain: "the-tasty-journal.firebaseapp.com",
  projectId: "the-tasty-journal",
  storageBucket: "the-tasty-journal.firebasestorage.app",
  messagingSenderId: "214465575922",
  appId: "1:214465575922:web:33e7ad5b6a012140dcc96b",
  measurementId: "G-BX0WL1RS0S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, where, doc, getDoc };