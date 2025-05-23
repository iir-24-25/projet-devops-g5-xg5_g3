// src/components/MesQuizs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './MesQuizs.css';

export default function MesQuizs() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Pour le menu utilisateur
  const navigate = useNavigate();

  // Charger l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
      } else {
        setUser(currentUser);
        fetchUserResults(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Charger les résultats de l'utilisateur
  const fetchUserResults = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/quiz-results/user/${userId}`);
      setResults(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des résultats :", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion déconnexion
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirige vers la page d'accueil/login
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Fonction pour aller sur login
  const handleLoginRedirect = () => {
    navigate('/');
  };

  // Composant pour afficher chaque résultat
  const ResultItem = ({ result }) => {
    const isPassed = result.score >= 50;
    const statusColor = isPassed ? '#4CAF50' : '#F44336';

    return (
      <div className="result-item">
        <h3>{result.quizName}</h3>
        <p><strong>Score :</strong> {result.score}%</p>
        <p><strong>Date :</strong> {new Date(result.takenAt).toLocaleDateString()}</p>
        <p style={{ color: statusColor }}>
          <strong>Status :</strong> {isPassed ? 'Réussi ✅' : 'Échoué ❌'}
        </p>
      </div>
    );
  };

  return (
    <div className="mesquizs-container">
      {/* Header avec utilisateur ou login */}
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
                      <li onClick={() => navigate('/mYprofil')}><span className="menu-dot"></span>Profil</li>
                      <li onClick={() => navigate('/mesquiz')}><span className="menu-dot"></span>My Quiz</li>
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

      {/* Bienvenue utilisateur */}
      <div className="welcome-banner">
        <h2>Bonjour {user?.displayName || 'Invité'},</h2>
      </div>

      {/* Titre et liste des quizs effectués */}
      <h2>Vos Quizs Effectués</h2>

      {loading ? (
        <p>Chargement des résultats...</p>
      ) : !user ? (
        <p>Veuillez vous connecter pour voir vos résultats.</p>
      ) : results.length === 0 ? (
        <p>Vous n'avez encore effectué aucun quiz.</p>
      ) : (
        <div className="results-list">
          {results.map((result) => (
            <ResultItem key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}