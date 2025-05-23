import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin'; // Import depuis firebaseAdmin.js
import { MdEmail, MdDelete } from 'react-icons/md';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom'; // Navigation
import './QuizCRUD.css'; // Ton CSS existant

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const navigate = useNavigate();

  // Charger les utilisateurs
  useEffect(() => {
    axios.get('http://localhost:9090/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      });
  }, []);

  // Vérifier si l'utilisateur est admin
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

  // Supprimer un utilisateur
  const handleDelete = (uid) => {
    if (window.confirm("Voulez-vous supprimer cet utilisateur ?")) {
      axios.delete(`http://localhost:9090/api/users/${uid}`)
        .then(() => {
          setUsers(prev => prev.filter(u => u.uid !== uid));
          alert('Utilisateur supprimé');
        })
        .catch(err => {
          alert('Erreur suppression : ' + err.message);
        });
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Obtenir l'icône du fournisseur
  const getProviderIcon = (user) => {
    if (!user.providerData || user.providerData.length === 0) return '❓';

    return user.providerData.map((p, index) => {
      if (p.providerId === 'password') return <MdEmail key={index} size={24} title="Email/Mot de passe" />;
      if (p.providerId === 'google.com') return <FcGoogle key={index} size={24} title="Google" />;
      if (p.providerId === 'facebook.com') return <FaFacebook key={index} size={24} color="#1877F2" title="Facebook" />;
      return <span key={index}>❓</span>;
    });
  };

  // Statut actif/inactif
  const getUserStatus = (user) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;

    if (!lastLoginDate || lastLoginDate < sevenDaysAgo) {
      return (
        <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
          <MdCancel size={18} color="red" style={{ marginRight: '4px' }} /> Inactif
        </span>
      );
    } else {
      return (
        <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
          <MdCheckCircle size={18} color="green" style={{ marginRight: '4px' }} /> Actif
        </span>
      );
    }
  };

  // Filtrer les utilisateurs par email
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
                  <Link to="/result" className="dropdown-item">Users result</Link>
                </div>
              </div>          
              <Link to="/categories" className="nav-item">Categorie</Link>
              <Link to="/settings" className="nav-item">Settings</Link>
            </div>
          </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">Gestion des Utilisateurs</h1>
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

        {/* Barre de recherche */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Tableau des utilisateurs */}
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom affiché</th>
                <th>UID</th>
                <th>Méthode de connexion</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.uid}>
                  <td>{user.email}</td>
                  <td>{user.displayName || 'N/A'}</td>
                  <td>{user.uid}</td>
                  <td>{getProviderIcon(user)}</td>
                  <td>{getUserStatus(user)}</td>
                  <td>
                    <button onClick={() => handleDelete(user.uid)} className="delete-btn">
                      <MdDelete size={24} color="red" title="Supprimer" />
                    </button>
                  </td>
                </tr>
              ))}
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
          <span> Page {currentPage} sur {totalPages} </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;