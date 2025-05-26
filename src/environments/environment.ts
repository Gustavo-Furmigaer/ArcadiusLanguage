// This file contains the Firebase configuration for the Arcadius Language project.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChWmWbcDgu_NnV6_yv2ei1IEZintfMHto",
  authDomain: "arcadius-language-8e1fa.firebaseapp.com",
  projectId: "arcadius-language-8e1fa",
  storageBucket: "arcadius-language-8e1fa.firebasestorage.app",
  messagingSenderId: "645155703084",
  appId: "1:645155703084:web:e7f4a60e63fd7752264489",
  measurementId: "G-NXTPVKGQS2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
