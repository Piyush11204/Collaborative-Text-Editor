
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7EpgHS5VxepBvi5F4KPkrhFfShtLfnSA",
  authDomain: "docclone-c6a34.firebaseapp.com",
  projectId: "docclone-c6a34",
  storageBucket: "docclone-c6a34.firebasestorage.app",
  messagingSenderId: "1056019760096",
  appId: "1:1056019760096:web:2934cab92eb69241d92185"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);