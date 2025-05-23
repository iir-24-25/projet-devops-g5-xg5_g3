import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Quiz.css';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const normalizeOptions = useCallback((question) => {
    if (question.options && Array.isArray(question.options)) {
      return question.options.map((opt, i) => ({
        id: opt.id || i,
        text: opt.text || opt.texte || opt.option || `Option ${i + 1}`,
        isCorrect: Boolean(opt.isCorrect || opt.correct || opt.estCorrecte)
      }));
    }

    const options = [];
    for (let i = 1; i <= 4; i++) {
      const optionText = question[`option${i}`] || question[`reponse${i}`];
      if (optionText) {
        options.push({
          id: i,
          text: optionText,
          isCorrect: question.reponseCorrecte === i
        });
      }
    }

    return options.length > 0 ? options : [
      { id: 1, text: "Aucune option disponible", isCorrect: false }
    ];
  }, []);

  const normalizeQuestions = useCallback((apiData) => {
    if (!apiData) return [];

    if (Array.isArray(apiData)) {
      return apiData.map((item, index) => ({
        id: item.id || index,
        text: item.question || item.texte || `Question ${index + 1}`,
        options: normalizeOptions(item)
      }));
    }

    if (apiData.questions && Array.isArray(apiData.questions)) {
      return apiData.questions.map((item, index) => ({
        id: item.id || index,
        text: item.question || item.texte || `Question ${index + 1}`,
        options: normalizeOptions(item)
      }));
    }

    return [];
  }, [normalizeOptions]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        const quizResponse = await axios.get(`http://localhost:9090/api/quizzes/${id}`);
        setQuizInfo(quizResponse.data);

        const questionsResponse = await axios.get(`http://localhost:9090/api/questions/quiz/${id}`);
        const normalizedQuestions = normalizeQuestions(questionsResponse.data);

        if (normalizedQuestions.length === 0) {
          throw new Error("Aucune question valide trouvée");
        }

        setQuestions(normalizedQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message || "Erreur de chargement du quiz");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id, normalizeQuestions]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted, questions]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!questions.length || selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.options.find(opt => opt.id === selectedOption)?.isCorrect;

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner"></div>
        <p>Chargement du quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container error-state">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="quiz-completed">
          <h2>Quiz Terminé!</h2>
          <p className="score">Votre score: {score}/{questions.length}</p>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="quiz-container">
        <h2>{quizInfo.nom || `Quiz ${id}`}</h2>
        <p>Aucune question disponible pour ce quiz.</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quizInfo.nom || `Quiz ${id}`}</h2>
        <div className="quiz-info">
          <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
          <span className="timer">Temps restant: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="question-container">
        <h3>{currentQuestion.text}</h3>

        <div className="options-container">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className={`option ${selectedOption === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.id)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-footer">
        <button
          className={`next-button ${selectedOption === null ? 'disabled' : ''}`}
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
