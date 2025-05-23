import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './QuizCRUD.css';

// Firebase imports
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin'; // Assure-toi que le chemin est correct

// React Router
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:9090/api';

const QuizCRUD = () => {
  const navigate = useNavigate(); // Pour la déconnexion et redirection

  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null); // null = pas d'édition, objet = édition
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 3;
  const [currentUser, setCurrentUser] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

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

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_URL}/quizzes`);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Erreur de récupération des quizzes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Erreur de récupération des catégories:', error);
    }
  };

  const handleEdit = (quiz) => {
    setForm({
      id: quiz.id,
      nom: quiz.nom,
      description: quiz.description,
      difficulte: quiz.difficulte,
      categorieId: quiz.categorie?.id || '',
      photo: null,
    });
  };

  const handleCloseForm = () => {
    setForm(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', form.nom);
    formData.append('description', form.description);
    formData.append('difficulte', form.difficulte);
    formData.append('categorieId', form.categorieId);
    if (form.photo) {
      formData.append('photo', form.photo);
    }

    try {
      await axios.put(`${API_URL}/quizzes/${form.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(null);
      fetchQuizzes(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await axios.delete(`${API_URL}/quizzes/${id}`);
        fetchQuizzes(); // Rafraîchir après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression du quiz:', error);
      }
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.nom && quiz.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || quiz.categorie?.id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

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
            <span className="nav-item active">Quiz</span>
            <div className="dropdown-content">
              <Link to="/quiz" className="dropdown-item">Liste des quiz</Link>
              <Link to="/create-quiz" className="dropdown-item">Créer un quiz</Link>
            </div>
          </div>

          <Link to="/questions" className="nav-item">Questions</Link>

         <div className="nav-item-dropdown">
            <span className="nav-item ">Users</span>
            <div className="dropdown-content">
              <Link to="/userlist" className="dropdown-item">Users List</Link>
              <Link to="/create-result" className="dropdown-item">Users result</Link>
            </div>
          </div>          
          <Link to="/categories" className="nav-item">Categorie</Link>
          <Link to="/settings" className="nav-item">Settings</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">Gestion des Quiz</h1>
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

        {/* Barre de recherche et filtre */}
        <div className="filter-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Formulaire affiché uniquement si on est en mode édition */}
        {form && (
          <div className="edit-form-overlay">
            <div className="edit-form">
              <h2>Modifier le Quiz</h2>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulté</label>
                  <select
                    name="difficulte"
                    value={form.difficulte}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    <option value="FACILE">FACILE</option>
                    <option value="MOYENNE">MOYENNE</option>
                    <option value="DIFFICILE">DIFFICILE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    name="categorieId"
                    value={form.categorieId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Photo</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="generate-btn">
                    Mettre à jour
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="cancel-btn"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tableau des quiz */}
        <div className="quiz-table-container">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Difficulté</th>
                <th>Catégorie</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuizzes.length > 0 ? (
                currentQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.id}</td>
                    <td>{quiz.nom}</td>
                    <td>{quiz.description}</td>
                    <td>{quiz.difficulte}</td>
                    <td>{quiz.categorie ? quiz.categorie.nom : 'Aucune catégorie'}</td>
                    <td>
                      {quiz.photo ? (
                        <img
                          src={`data:image/jpeg;base64,${quiz.photo}`}
                          alt={quiz.nom}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          className="card-image"
                        />
                      ) : (
                        'Pas d\'image'
                      )}
                    </td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(quiz)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(quiz.id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    Aucun quiz trouvé
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

export default QuizCRUD;