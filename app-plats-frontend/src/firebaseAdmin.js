// src/firebaseAdmin.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Ta config Firebase Admin
const firebaseAdminConfig = {
  apiKey: "AIzaSyBjGpJFnZQ1A3POCNm8gieuyEzfIECl_CY",
  authDomain: "adminquiz-b39fc.firebaseapp.com",
  projectId: "adminquiz-b39fc",
  storageBucket: "adminquiz-b39fc.firebasestorage.app",
  messagingSenderId: "706404108456",
  appId: "1:706404108456:web:36b6b7654d261234fd9a9d",
  measurementId: "G-YSL069XFQ9"
};

// Initialisation de l'instance Firebase Admin (avec un nom unique)
const adminApp = initializeApp(firebaseAdminConfig, 'admin-app'); // 👈 Nom d'instance unique
const adminAuth = getAuth(adminApp); // Auth spécifique pour l'admin

export { adminAuth };