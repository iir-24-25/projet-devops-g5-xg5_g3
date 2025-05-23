// src/components/MonProfil.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './MonProfil.css';

export default function MonProfil() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Menu utilisateur
  const navigate = useNavigate();

  // Charger l'utilisateur connecté
  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (!currentUser) {
      setUser(null);
      navigate('/'); // Redirige vers login si non connecté
    } else {
      setUser(currentUser);
    }
  });

  return () => unsubscribe();
}, [navigate]);  // <- ici on ajoute navigate


  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Réauthentifier l'utilisateur
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Changer le mot de passe
      await updatePassword(user, newPassword);
      setSuccess('Mot de passe mis à jour avec succès.');
    } catch (err) {
      setError('Erreur : ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="profil-container">
      {/* Header */}
      <header className="header">
        <h1 className="app-title">Quiz App</h1>

        <div className="header-right">
          {user ? (
            <>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
              <div className="user-profile">
                <div className="profile-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                  <span className="user-name">{user.displayName}</span>
                  <div className="avatar">
                    {user.displayName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                </div>

                {menuOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => navigate('/mYprofil')}>
                        <span className="menu-dot"></span>Profil
                      </li>
                      <li onClick={() => navigate('/mesquiz')}>
                        <span className="menu-dot"></span>My Quiz
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="login-btn" onClick={handleLoginRedirect}>
              Login
            </button>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <div className="main-conHtent">
        <div className="profile-card">
          <h2>Personal details</h2>

          {/* Avatar */}
          <div className="avatar-container">
            {user && (
              <div className="avatar">
                {user.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Nom d'utilisateur */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={user?.displayName || ''}
              disabled
            />
          </div>

          {/* Formulaire de changement de mot de passe */}
          <h3>Change Password</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-group">
            <label>Your Old Password</label>
            <input
              type="password"
              placeholder="Your Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Your New Password</label>
            <input
              type="password"
              placeholder="Your New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={handleChangePassword} className="save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}