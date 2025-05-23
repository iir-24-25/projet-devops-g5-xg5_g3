import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin'; // Assure-toi du chemin
import { Link, useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import './QuizCRUD.css'; // Ton CSS existant

const QuizResultsTable = () => {
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const navigate = useNavigate();

  // Charger les résultats des quiz
  useEffect(() => {
    axios.get('http://localhost:9090/api/quiz-results')
      .then(res => {
        setResults(res.data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des résultats", err);
      });
  }, []);

  // Charger les utilisateurs Firebase pour afficher les noms
  useEffect(() => {
    axios.get('http://localhost:9090/api/users')
      .then(res => {
        const userMap = res.data.reduce((acc, user) => {
          acc[user.uid] = user.displayName || user.email || 'Utilisateur inconnu';
          return acc;
        }, {});
        setUsers(userMap);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des utilisateurs", err);
      });
  }, []);

  // Vérifier si l'utilisateur est connecté en tant qu'admin
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

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Filtrer les résultats par nom d'utilisateur
  const filteredResults = results.filter(result => {
    const userName = users[result.firebaseUserId]?.toLowerCase() || '';
    return userName.includes(searchTerm.toLowerCase());
  });

  // Pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  // Composant Score avec icône et couleur conditionnelle
  const renderScore = (score) => {
    const isPassed = score >= 50;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        color: isPassed ? 'green' : 'red',
        fontWeight: 'bold'
      }}>
        {isPassed ? (
          <MdCheckCircle size={20} color="green" style={{ marginRight: '6px' }} />
        ) : (
          <MdCancel size={20} color="red" style={{ marginRight: '6px' }} />
        )}
        {score}%
      </div>
    );
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
                      <span className="nav-item ">Quiz</span>
                      <div className="dropdown-content">
                        <Link to="/quiz" className="dropdown-item">Liste des quiz</Link>
                        <Link to="/create-quiz" className="dropdown-item">Créer un quiz</Link>
                      </div>
                    </div>
          
                    <Link to="/questions" className="nav-item">Questions</Link>
          
                   <div className="nav-item-dropdown">
                      <span className="nav-item active">Users</span>
                      <div className="dropdown-content">
                        <Link to="/userlist" className="dropdown-item">Users List</Link>
                        <Link to="/result" className="dropdown-item">Users resultats</Link>
                      </div>
                    </div>          
                    <Link to="/categories" className="nav-item">Categorie</Link>
                    <Link to="/settings" className="nav-item">Settings</Link>
                  </div>
                </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">Résultats des Quiz</h1>
          <div className="user-controls">
            <button className="logout-btn" onClick={handleLogout}>LogOut</button>
            <div className="user-info">
              <span>{currentUser?.displayName || currentUser?.email}</span>
              <div className="user-avatar-container">
                <div className="user-avatar"></div>
                <span className="dropdown-icon">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Barre de recherche */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom d'utilisateur"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Tableau des résultats */}
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Nom Utilisateur</th>
                <th>Nom du Quiz</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.length > 0 ? (
                currentResults.map(result => (
                  <tr key={result.id}>
                    <td>{users[result.firebaseUserId] || 'Inconnu'}</td>
                    <td>{result.quizName || 'Chargement...'}</td>
                    <td>{renderScore(result.score)}</td>
                    <td>{new Date(result.takenAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    Aucun résultat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span> Page {currentPage} sur {totalPages || 1} </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsTable;