import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../services/api';

export default function CreateQuizPage() {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [{
      text: '',
      options: [{ text: '', isCorrect: false }],
      type: 'MULTIPLE_CHOICE'
    }]
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, {
        text: '',
        options: [{ text: '', isCorrect: false }],
        type: 'MULTIPLE_CHOICE'
      }]
    });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuiz(quiz);
      alert('Quiz créé avec succès!');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="container">
      <h1>Créer un nouveau quiz</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input 
            type="text" 
            value={quiz.title}
            onChange={(e) => setQuiz({...quiz, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz({...quiz, description: e.target.value})}
          />
        </div>

        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="question-block">
            <h3>Question {qIndex + 1}</h3>
            <input
              type="text"
              placeholder="Texte de la question"
              value={question.text}
              onChange={(e) => {
                const newQuestions = [...quiz.questions];
                newQuestions[qIndex].text = e.target.value;
                setQuiz({...quiz, questions: newQuestions});
              }}
              required
            />

            <select
              value={question.type}
              onChange={(e) => {
                const newQuestions = [...quiz.questions];
                newQuestions[qIndex].type = e.target.value;
                setQuiz({...quiz, questions: newQuestions});
              }}
            >
              <option value="MULTIPLE_CHOICE">QCM</option>
              <option value="TRUE_FALSE">Vrai/Faux</option>
            </select>

            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="option">
                <input
                  type="text"
                  placeholder="Option de réponse"
                  value={option.text}
                  onChange={(e) => {
                    const newQuestions = [...quiz.questions];
                    newQuestions[qIndex].options[oIndex].text = e.target.value;
                    setQuiz({...quiz, questions: newQuestions});
                  }}
                  required
                />
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => {
                    const newQuestions = [...quiz.questions];
                    newQuestions[qIndex].options[oIndex].isCorrect = e.target.checked;
                    setQuiz({...quiz, questions: newQuestions});
                  }}
                />
                <label>Correcte</label>
              </div>
            ))}

            <button type="button" onClick={() => addOption(qIndex)}>
              Ajouter une option
            </button>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          Ajouter une question
        </button>

        <button type="submit">Enregistrer le quiz</button>
      </form>
    </div>
  );
}