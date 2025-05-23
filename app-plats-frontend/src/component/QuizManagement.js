import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuizManagement.css";

const QuizManagement = () => {
  const [quizData, setQuizData] = useState([]); // Données des quizzes
  const [categories, setCategories] = useState([]); // Catégories pour le filtre
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [filterCategory, setFilterCategory] = useState(""); // Catégorie sélectionnée pour le filtrage
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  // Fonction pour récupérer les quizzes depuis l'API
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9090/api/quizzes");
      console.log("Données de l'API reçues:", response.data);

      const cleanedData = response.data.map((quiz) => ({
        quiz_id: quiz.quiz_id || "N/A",
        quiz_name: quiz.quiz_name || "Unnamed Quiz",
        description: quiz.description || "No description",
        difficulty: quiz.difficulty || "Unknown",
        categorie: {
          id: quiz.categorie?.id || "N/A",
          nom: quiz.categorie?.nom || "Sans catégorie",
        },
      }));

      console.log("Données nettoyées:", cleanedData);
      setQuizData(cleanedData); // Stocker les données nettoyées dans le state
    } catch (error) {
      console.error("Erreur lors du chargement des quizzes:", error);
      setError("Erreur lors du chargement des quizzes");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9090/api/categories");
      console.log("Catégories reçues:", response.data);

      const cleanedCategories = response.data.map((category) => ({
        id: category.id,
        nom: category.nom,
      }));

      console.log("Catégories nettoyées:", cleanedCategories);
      setCategories(cleanedCategories); // Stocker les catégories nettoyées dans le state
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  // Charger les données des quizzes et des catégories au montage du composant
  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  // Filtrer les quizzes en fonction du terme de recherche et de la catégorie
  const filteredQuizzes = quizData.filter((quiz) => {
    const matchesSearch =
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.quiz_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "" || quiz.categorie.nom === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="quiz-container">
      <div className="sidebar">
        <h2>Quiz app</h2>
        <ul>
          {["Dashboard", "Quiz", "Questions", "Users", "Categorie", "Users Quiz"].map(
            (item, index) => (
              <li key={index} className={item === "Categorie" ? "active" : ""}>
                <span className="dot" />
                {item}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="main">
        <div className="topbar">
          <h1>Quiz Management</h1>
          <div className="right">
            <button
              style={{
                background: "black",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              Logout
            </button>
            <span>Anasse lekkioui</span>
            <div className="profile-pic" />
          </div>
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: "6px", marginLeft: "10px" }}
          >
            <option value="">Filter By Categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.nom}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading-indicator">Chargement...</div>}

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Description</th>
              <th>Difficulty</th>
              <th>Quiz Name</th>
              <th>Categorie</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <tr key={quiz.quiz_id}>
                  <td>{quiz.quiz_id}</td>
                  <td>{quiz.description}</td>
                  <td>{quiz.difficulty}</td>
                  <td>{quiz.quiz_name}</td>
                  <td>{quiz.categorie.nom}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Aucun quiz trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizManagement;
