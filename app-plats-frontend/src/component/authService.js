import { auth, googleProvider } from '../firebase';  // Importation de l'authentification et du provider Google
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';

// Enregistrer un utilisateur avec email et mot de passe
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Connexion avec email et mot de passe
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Connexion avec Google
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Déconnexion
export const logout = () => {
  return signOut(auth);
};
