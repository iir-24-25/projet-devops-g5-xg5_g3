import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QuizCRUD.css'; // Ton CSS existant

// Firebase Admin
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin';

// React Router
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:9090/api';

const Settings = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post(`${API_URL}/change-password`, {
        email: currentUser.email,
        oldPassword,
        newPassword
      });

      setMessage("Mot de passe changé avec succès !");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage("Erreur lors du changement de mot de passe.");
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
     <div className="sidebar">
                       <div className="app-title">Quiz App</div>
                       <div className="nav-menu">
                         <Link to="/dashboard" className="nav-item">Dashboard</Link>
               
                         {/* Menu déroulant Quiz */}
                         <div className="nav-item-dropdown">
                           <span className="nav-item  ">Quiz</span>
                           <div className="dropdown-content">
                             <Link to="/quiz" className="dropdown-item">Quiz Liste</Link>
                             <Link to="/create-quiz" className="dropdown-item">create a quiz</Link>
                           </div>
                         </div>
               
                         <Link to="/questions" className="nav-item">Questions</Link>
               
                        <div className="nav-item-dropdown">
                           <span className="nav-item ">Users</span>
                           <div className="dropdown-content">
                             <Link to="/userlist" className="dropdown-item">Users List</Link>
                             <Link to="/result" className="dropdown-item">Users resultats</Link>
                           </div>
                         </div>          
                         <Link to="/categories" className="nav-item">Categorie</Link>
                         <Link to="/settings" className="nav-item active">Settings</Link>
                       </div>
                     </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">Settings</h1>
          <div className="user-controls">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <div className="user-info">
              <span>{currentUser?.displayName || currentUser?.email}</span>
              <div className="user-avatar-container">
                <div className="user-avatar"></div>
                <span className="dropdown-icon">▼</span>
              </div>
            </div>
          </div>
        </header>

        <div className="settings-form-container">
          <h2>Changer le mot de passe</h2>
          <form onSubmit={handleChangePassword} className="form-grid">
            <div className="form-group">
              <label>Ancien mot de passe</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Ancien mot de passe"
                required
              />
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer"
                required
              />
            </div>
            <button type="submit" className="generate-btn">
              Changer le mot de passe
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;