import { initializeApp } from 'firebase/app';  // Importer la fonction pour initialiser l'application Firebase
import { getAuth, GoogleAuthProvider } from 'firebase/auth';  // Importer l'authentification et le fournisseur Google

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8YVAMYNsa8ZGZ7mYMAqaQsoQqydQIjfo",
  authDomain: "quizapp-f6a2c.firebaseapp.com",
  projectId: "quizapp-f6a2c",
  storageBucket: "quizapp-f6a2c.appspot.com",
  messagingSenderId: "497998671383",
  appId: "1:497998671383:web:aeffa7428fad070562b652",
  measurementId: "G-C1QNWG8QNX"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Authentification et fournisseur Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
