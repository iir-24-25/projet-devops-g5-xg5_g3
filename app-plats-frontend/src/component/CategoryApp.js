import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './CategoryApp.css';

// Firebase Admin
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin'; // Ajuste selon ta structure

// React Router
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:9090/api';

const CategoryApp = () => {
  const navigate = useNavigate(); // Pour la navigation

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, nom: '' });
  const [currentUser, setCurrentUser] = useState(null); // Pour stocker l'utilisateur connecté

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/admin/login');
      }
    });

    fetchCategories();

    return () => unsubscribe();
  }, [navigate]);

  // Récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories', err);
    }
  };

  // Gérer les changements dans le  formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Soumettre le formulaire pour ajoutter ou modifier une catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { nom: form.nom };

    if (form.id) {
      await axios.put(`${API_URL}/categories/${form.id}`, categoryData);
    } else {
      await axios.post(`${API_URL}/categories`, categoryData);
    }

    setForm({ id: null, nom: '' });
    fetchCategories();
  };

  // Modifier une categorie
  const handleEdit = (category) => {
    setForm({ id: category.id, nom: category.nom });
  };

  // Supprimer une categorie
  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
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
                         <span className="nav-item ">Quiz</span>
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
                       <Link to="/categories" className="nav-item active">Categorie</Link>
                       <Link to="/settings" className="nav-item">Settings</Link>
                     </div>
                   </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">Gestion des Catégories</h1>
          <div className="user-controls">
            {/* Bouton Logout */}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>

            {/* Nom de l'utilisateur connecté */}
            <div className="user-info">
              <span>{currentUser?.displayName || currentUser?.email}</span>
              <div className="user-avatar-container">
                <div className="user-avatar"></div>
                <span className="dropdown-icon">▼</span>
              </div>
            </div>
          </div>
        </header>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Nom de la Catégorie</label>
              <input
                type="text"
                name="nom"
                placeholder="Nom de la catégorie"
                value={form.nom}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="generate-btn">
              {form.id ? 'Modifier' : 'Ajouter'}
            </button>
          </form>
        </div>

        <div className="category-table-container">
          <table className="category-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.nom}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(category)}>
                        <FaEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(category.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    Aucune catégorie trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryApp;