<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './QuizCRUD.css';

// Firebase imports
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin'; // Vérifie le chemin

// React Router
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:9090/api';

const QuestionCRUD = () => {
  const navigate = useNavigate();
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionCRUD.css"; // CSS modernisé ici
//CRUD
function QuestionCRUD() {
>>>>>>> 9d32da03c71a6780db310f68d0ae28be7f8197f4
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    fetchQuestions();
    fetchQuizzes();
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

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_URL}/questions`);
      
      let data = [];

      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.content)) {
        data = res.data.content;
      }

      console.log("Données reçues:", data); // <= Debug
      setQuestions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des questions :", error);
      setQuestions([
        {
          id: 1,
          enonce: "Exemple : Quelle est la capitale de la France ?",
          type: "QCM",
          points: 5,
          explication: "La bonne réponse est Paris.",
          quizId: 1
        },
        {
          id: 2,
          enonce: "Exemple : Combien fait 2 + 2 ?",
          type: "Numérique",
          points: 2,
          explication: "La réponse est 4.",
          quizId: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_URL}/quizzes`);

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.content)) {
        data = res.data.content;
      }

      setQuizzes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des quiz:", error);
      setQuizzes([
        { id: 1, nom: "Géographie" },
        { id: 2, nom: "Maths" }
      ]);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.enonce && q.enonce.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuiz =
      !selectedQuiz || q.quizId === parseInt(selectedQuiz);
    return matchesSearch && matchesQuiz;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="app-title">Quiz App</div>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>

          {/* Menu déroulant Quiz */}
          <div className="nav-item-dropdown">
            <span className="nav-item">Quiz</span>
            <div className="dropdown-content">
              <Link to="/quiz" className="dropdown-item">Liste des quiz</Link>
              <Link to="/create-quiz" className="dropdown-item">Créer un quiz</Link>
            </div>
          </div>

          <Link to="/questions" className="nav-item active">Questions</Link>

          <div className="nav-item-dropdown">
            <span className="nav-item">Users</span>
            <div className="dropdown-content">
              <Link to="/userlist" className="dropdown-item">Liste des utilisateurs</Link>
              <Link to="/result" className="dropdown-item">Résultats des quiz</Link>
            </div>
          </div>

<<<<<<< HEAD
          <Link to="/categories" className="nav-item">Categorie</Link>
          <Link to="/settings" className="nav-item">Paramètres</Link>
=======
              <Button type="submit">{editId ? "Modifier" : "Enregistrer"}</Button>
            </Form>
          </Card>

          <Card title="Liste des Questions">
            <Table
              headers={["Énoncé", "Explication", "Points", "Type", "Quiz", "Actions"]}
              data={questions}
              renderRow={(q) => (
                <>
                  <td>{q.enonce}</td>
                  <td>{q.explication}</td>
                  <td>{q.points}</td>
                  <td>{q.type}</td>
                  <td>{q.quiz?.nom || "—"}</td>
                  <td>
                    <Btn onClick={() => handleEdit(q)}>Modifier</Btn>
                    <Btn variant="danger" onClick={() => handleDelete(q.id)}>Supprimer</Btn>
                  </td>
                </>
              )}
            />
          </Card>
        </section>
      </main>
    </div>
  );
}

// --- Composants réutilisables ----
const Sidebar = () => (
  <aside className="sidebar">
    <h2 className="app-title">Quiz App</h2>
    <nav className="menu">
      {["Dashboard", "Quiz", "Questions", "Users", "Categorie", "Settings"].map((item) => (
        <div key={item} className={`menu-item ${item === "Questions" ? "active" : ""}`}>
          {item}
>>>>>>> 9d32da03c71a6780db310f68d0ae28be7f8197f4
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">Gestion des Questions</h1>
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
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Sélection de quiz */}
        <div className="category-select-container">
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="category-select"
          >
            <option value="">Tous les quiz</option>
            {Array.isArray(quizzes) &&
              quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.nom}
                </option>
              ))}
          </select>
        </div>

        {/* Tableau des questions */}
        <div className="quiz-table-container">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Énoncé</th>
                <th>Type</th>
                <th>Points</th>
                <th>Explication</th>
                <th>Quiz ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((q) => (
                  <tr key={q.id}>
                    <td>{q.id}</td>
                    <td>{q.enonce}</td>
                    <td>{q.type}</td>
                    <td>{q.points}</td>
                    <td>{q.explication}</td>
                    <td>{q.quizId}</td>
                    <td>
                      <button className="action-btn edit" title="Modifier">
                        <FaEdit />
                      </button>
                      <button className="action-btn delete" title="Supprimer">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    Aucune question trouvée
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

export default QuestionCRUD;