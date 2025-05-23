import React, { useEffect, useState } from "react";

const QuizTakingPage = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Charger le quiz et ses questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le quiz
        const quizRes = await fetch(`http://localhost:9090/api/quizzes/${quizId}`);
        const quizData = await quizRes.json();
        setQuiz(quizData);

        // Récupérer les questions associées au quiz
        const questionRes = await fetch(`http://localhost:9090/api/questions/quiz/${quizId}`);
        const questionData = await questionRes.json();

        // Si la réponse est paginée (ex : { content: [...] })
        const questionList = Array.isArray(questionData) ? questionData : questionData.content || [];

        setQuestions(questionList);

        // Initialiser les réponses
        const initialAnswers = {};
        questionList.forEach((q) => {
          initialAnswers[q.id] = [];
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    fetchData();
  }, [quizId]);

  // Gérer la sélection des options
  const handleOptionChange = (questionId, optionId, isChecked) => {
    setAnswers((prev) => {
      const currentSelections = prev[questionId] || [];

      if (isChecked) {
        return { ...prev, [questionId]: [...currentSelections, optionId] };
      } else {
        return {
          ...prev,
          [questionId]: currentSelections.filter((id) => id !== optionId),
        };
      }
    });
  };

  // Soumettre les réponses et calculer le score
  const submitQuiz = () => {
    let totalPoints = 0;

    questions.forEach((question) => {
      const selectedOptions = answers[question.id] || [];
      const correctOptions = question.options
        .filter((opt) => opt.correcte)
        .map((opt) => opt.id);

      // Vérifier si les réponses sélectionnées correspondent exactement aux bonnes réponses
      if (
        selectedOptions.length === correctOptions.length &&
        selectedOptions.every((id) => correctOptions.includes(id))
      ) {
        totalPoints += question.points;
      }
    });

    setScore(totalPoints);
  };

  // Afficher l'image du quiz, si disponible
  const renderQuizImage = () => {
    if (!quiz?.photo) return null;

    // Supposons que quiz.photo est un tableau d'octets encodé en base64
    const photoUrl = `data:image/jpeg;base64,${arrayBufferToBase64(quiz.photo)}`;
    return <img src={photoUrl} alt="Quiz" style={{ maxWidth: "100%", marginTop: "20px" }} />;
  };

  // Convertir Uint8Array (BLOB) vers Base64
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  if (!quiz || !questions.length) {
    return <p>Chargement du quiz...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{quiz.nom}</h2>
      <p>{quiz.description}</p>

      {/* Affichage de l’image du quiz */}
      {renderQuizImage()}

      <hr />

      {/* Questions */}
      {questions.map((question) => (
        <div key={question.id} style={{ marginBottom: "20px" }}>
          <h4>{question.enonce}</h4>
          {question.options.map((option) => (
            <div key={option.id}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleOptionChange(
                      question.id,
                      option.id,
                      e.target.checked
                    )
                  }
                />
                {option.texte}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={submitQuiz}>Soumettre Réponses</button>

      {/* Résultat final */}
      {score !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Votre score : {score}/{questions.reduce((sum, q) => sum + q.points, 0)}</h3>
        </div>
      )}
    </div>
  );
};

export default QuizTakingPage;