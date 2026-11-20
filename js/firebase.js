import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC5QF67bSXP8xjlwzZCPyOeysQwCEWGmJs",
  authDomain: "campus-connect-27c78.firebaseapp.com",
  projectId: "campus-connect-27c78",
  storageBucket: "campus-connect-27c78.firebasestorage.app",
  messagingSenderId: "278543075787",
  appId: "1:278543075787:web:8f85f96a6e982d576dce4e",
  measurementId: "G-TDXPLESPDR"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
