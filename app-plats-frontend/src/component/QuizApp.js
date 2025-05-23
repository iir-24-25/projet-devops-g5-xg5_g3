import './QuizApp.css';
// ou
import './QuizCRUD.css'; // selon ce que tu veux vraiment
// puis les autres imports nécessaires
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin';
import { Link, useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:9090/api';

const QuizApp = () => {
  const navigate = useNavigate(); // Pour la navigation
  const [currentUser, setCurrentUser] = useState(null); // Utilisateur connecté

  // États principaux
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  // Formulaire de création du quiz
  const [quizForm, setQuizForm] = useState({
    id: null,
    nom: '',
    description: '',
    difficulte: '',
    categorieId: '',
    photo: null
  });

  // Formulaire de création de question
  const [questionForm, setQuestionForm] = useState({
    enonce: '',
    type: '', // unique / choix_multiple
    points: 0,
    explication: '',
    options: [],              // Liste des options
    reponsesCorrectes: []     // Indices des réponses correctes
  });

  // --- Récupération des données au montage ---
  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
    if (currentQuizId) {
      fetchQuestions(currentQuizId);
    }
  }, [currentQuizId]);

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

  // --- Récupérer les quizzes ---
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_URL}/quizzes`);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des quizzes:', error);
    }
  };

  // --- Récupérer les catégories ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  // --- Récupérer les questions d’un quiz ---
  const fetchQuestions = async (quizId) => {
    try {
      const res = await axios.get(`${API_URL}/questions/quiz/${quizId}`);
      setQuestions(res.data);
    } catch (error) {
      console.error(`Impossible de charger les questions du quiz ${quizId}`, error);
    }
  };

  // --- Gestion du formulaire du quiz ---
  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizForm({ ...quizForm, [name]: value });
  };

  const handleQuizFileChange = (e) => {
    setQuizForm({ ...quizForm, photo: e.target.files[0] });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', quizForm.nom);
    formData.append('description', quizForm.description);
    formData.append('difficulte', quizForm.difficulte);
    formData.append('categorieId', quizForm.categorieId);
    if (quizForm.photo) {
      formData.append('photo', quizForm.photo);
    }

    try {
      let response;
      if (quizForm.id) {
        response = await axios.put(`${API_URL}/quizzes/${quizForm.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post(`${API_URL}/quizzes`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const createdQuiz = response.data;
      setQuizForm({
        id: createdQuiz.id,
        nom: createdQuiz.nom,
        description: createdQuiz.description,
        difficulte: createdQuiz.difficulte,
        categorieId: createdQuiz.categorie?.id || '',
        photo: null
      });
      setCurrentQuizId(createdQuiz.id);
      fetchQuizzes();
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz:", error);
    }
  };

  // --- Gestion des options ---
  const addOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, ''],
      reponsesCorrectes: []
    }));
  };

  const removeOption = (index) => {
    setQuestionForm(prev => {
      const newOptions = prev.options.filter((_, i) => i !== index);
      const newCorrectes = prev.reponsesCorrectes.filter(i => i !== index);
      return {
        ...prev,
        options: newOptions,
        reponsesCorrectes: newCorrectes
      };
    });
  };

  const handleOptionChange = (index, value) => {
    setQuestionForm(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const toggleCorrectAnswer = (index) => {
    setQuestionForm(prev => {
      const correctes = [...prev.reponsesCorrectes];

      if (questionForm.type === 'unique') {
        return { ...prev, reponsesCorrectes: [index] };
      }

      const idx = correctes.indexOf(index);
      if (idx > -1) {
        correctes.splice(idx, 1); // Décocher
      } else {
        correctes.push(index); // Cocher
      }

      return { ...prev, reponsesCorrectes: correctes };
    });
  };

  // --- Gestion des questions ---
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: value,
      quiz: { id: currentQuizId },
      ...(name === 'type' && { reponsesCorrectes: [] }) // Réinitialise les réponses
    }));
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/questions`, {
        ...questionForm,
        quiz: { id: currentQuizId },
        options: questionForm.options.map((texte, index) => ({
          texte,
          correcte: questionForm.reponsesCorrectes.includes(index)
        }))
      });
      setQuestionForm({
        enonce: '',
        type: '',
        points: 0,
        explication: '',
        options: [],
        reponsesCorrectes: []
      });
      fetchQuestions(currentQuizId);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la question", error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await axios.delete(`${API_URL}/questions/${id}`);
      fetchQuestions(currentQuizId);
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
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
                      <span className="nav-item active">Quiz</span>
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
                    <Link to="/settings" className="nav-item">Settings</Link>
                  </div>
                </div>


      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">
            {currentQuizId ? "Création des Questions" : "Création d'un Quiz"}
          </h1>
          <div className="user-controls">
            {/* Bouton Logout */}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>

            {/* Nom de l'utilisateur connecté */}
            <div className="user-info">
              <span>
                {currentUser?.displayName ||
                  currentUser?.email?.split('@')[0] ||
                  'Utilisateur'}
              </span>
              <div className="user-avatar-container">
                <div className="user-avatar"></div>
                <span className="dropdown-icon">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Création du quiz */}
        {!currentQuizId && (
          <div className="form-container">
            <h2>Créer un nouveau quiz</h2>
            <form onSubmit={handleQuizSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Nom du Quiz</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom du quiz"
                  value={quizForm.nom}
                  onChange={handleQuizChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={quizForm.description}
                  onChange={handleQuizChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Difficulté</label>
                <select
                  name="difficulte"
                  value={quizForm.difficulte}
                  onChange={handleQuizChange}
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
                  value={quizForm.categorieId}
                  onChange={handleQuizChange}
                  required
                >
                  <option value="">-- Choisir une catégorie --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleQuizFileChange}
                />
              </div>
              <button type="submit" className="generate-btn">
                Créer le Quiz
              </button>
            </form>
          </div>
        )}

        {/* Gestion des questions */}
        {currentQuizId && (
          <>
            <div className="form-container">
              <h3>Ajouter une question pour : "{quizForm.nom}"</h3>
              <form onSubmit={handleQuestionSubmit}>
                <div className="form-group">
                  <label>Énoncé</label>
                  <input
                    type="text"
                    name="enonce"
                    placeholder="Énoncé de la question"
                    value={questionForm.enonce}
                    onChange={handleQuestionChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={questionForm.type}
                    onChange={handleQuestionChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="unique">Unique</option>
                    <option value="choix_multiple">Choix multiple</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Points</label>
                  <input
                    type="number"
                    name="points"
                    value={questionForm.points}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({ ...prev, points: parseInt(e.target.value) }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Explication</label>
                  <input
                    type="text"
                    name="explication"
                    value={questionForm.explication}
                    onChange={handleQuestionChange}
                  />
                </div>

                {/* Options dynamiques */}
                <h4>Options</h4>
                {questionForm.options.map((opt, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {(questionForm.type === "unique" || questionForm.type === "choix_multiple") && (
                      <label>
                        <input
                          type={questionForm.type === "unique" ? "radio" : "checkbox"}
                          checked={questionForm.reponsesCorrectes.includes(index)}
                          onChange={() => toggleCorrectAnswer(index)}
                          name={questionForm.type === "unique" ? "correctAnswer" : undefined}
                        />
                        Correct ?
                      </label>
                    )}
                    <button type="button" onClick={() => removeOption(index)}>Supprimer</button>
                  </div>
                ))}

                <button type="button" onClick={addOption}>+ Ajouter option</button>
                <button type="submit" className="generate-btn">
                  Ajouter la question
                </button>
              </form>
            </div>

            {/* Tableau des questions */}
            <div className="quiz-table-container">
              <h4>Liste des Questions</h4>
              <table className="quiz-table">
                <thead>
                  <tr>
                    <th>Énoncé</th>
                    <th>Type</th>
                    <th>Points</th>
                    <th>Explication</th>
                    <th>Options</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions && Array.isArray(questions) && questions.length > 0 ? (
                    questions.map((q) => (
                      <tr key={q.id}>
                        <td>{q.enonce}</td>
                        <td>{q.type}</td>
                        <td>{q.points}</td>
                        <td>{q.explication}</td>
                        <td>
                          {Array.isArray(q.options) && q.options.length > 0 ? (
                            q.options.map((opt, i) => (
                              <div key={i}>{opt.texte}</div>
                            ))
                          ) : (
                            "Aucune option"
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="delete-btn"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        Aucune question trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizApp;