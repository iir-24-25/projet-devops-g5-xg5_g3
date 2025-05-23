import React, { useState } from "react";

const QuizCreationPage = () => {
  const [quizData, setQuizData] = useState({
    nom: "",
    description: "",
    difficulte: "",
    categorieId: "",
    photo: null,
    questions: [
      {
        enonce: "",
        type: "multiple_choice",
        points: 1,
        explication: "",
        options: [
          { texte: "", correcte: false },
          { texte: "", correcte: false },
        ],
      },
    ],
  });

  const handleChange = (e, field, index = null) => {
    if (index !== null && field === "questions") {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [e.target.name]: e.target.value,
      };
      setQuizData({ ...quizData, questions: updatedQuestions });
    } else if (field === "options") {
      const questionIndex = parseInt(index.split("-")[0]);
      const optionIndex = parseInt(index.split("-")[1]);

      const updatedQuestions = [...quizData.questions];
      updatedQuestions[questionIndex].options[optionIndex] = {
        ...updatedQuestions[questionIndex].options[optionIndex],
        [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      };
      setQuizData({ ...quizData, questions: updatedQuestions });
    } else {
      setQuizData({ ...quizData, [field]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    setQuizData({ ...quizData, photo: e.target.files[0] });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          enonce: "",
          type: "multiple_choice",
          points: 1,
          explication: "",
          options: [
            { texte: "", correcte: false },
            { texte: "", correcte: false },
          ],
        },
      ],
    });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push({
      texte: "",
      correcte: false,
    });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const submitQuiz = async () => {
    try {
      // Créer le quiz
      const formData = new FormData();
      formData.append("nom", quizData.nom);
      formData.append("description", quizData.description);
      formData.append("difficulte", quizData.difficulte);
      formData.append("categorieId", quizData.categorieId);
      if (quizData.photo) formData.append("photo", quizData.photo);

      const quizRes = await fetch("http://localhost:9090/api/quizzes", {
        method: "POST",
        body: formData,
      });

      const createdQuiz = await quizRes.json();

      // Créer les questions
      for (let q of quizData.questions) {
        const questionRes = await fetch("http://localhost:9090/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...q,
            quiz: { id: createdQuiz.id },
          }),
        });

        const createdQuestion = await questionRes.json();

        // Créer les options
        await fetch(`http://localhost:9090/api/options/question/${createdQuestion.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(q.options),
        });
      }

      alert("Quiz créé avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du quiz.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Créer un Nouveau Quiz</h2>
      <input placeholder="Nom" name="nom" onChange={(e) => handleChange(e, "nom")} />
      <br />
      <textarea placeholder="Description" name="description" onChange={(e) => handleChange(e, "description")} />
      <br />
      <select name="difficulte" onChange={(e) => handleChange(e, "difficulte")}>
        <option value="">-- Sélectionner la difficulté --</option>
        <option value="facile">Facile</option>
        <option value="moyen">Moyen</option>
        <option value="difficile">Difficile</option>
      </select>
      <br />
      <input placeholder="ID Catégorie" name="categorieId" onChange={(e) => handleChange(e, "categorieId")} />
      <br />
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <hr />

      {quizData.questions.map((question, qIndex) => (
        <div key={qIndex} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h4>Question {qIndex + 1}</h4>
          <input
            placeholder="Énoncé"
            name="enonce"
            onChange={(e) => handleChange(e, "questions", qIndex)}
          />
          <br />
          <input
            placeholder="Explication"
            name="explication"
            onChange={(e) => handleChange(e, "questions", qIndex)}
          />
          <br />
          Points:{" "}
          <input
            type="number"
            name="points"
            defaultValue="1"
            onChange={(e) => handleChange(e, "questions", qIndex)}
          />
          <br />
          {question.options.map((option, oIndex) => (
            <div key={oIndex}>
              <input
                placeholder="Option"
                name="texte"
                onChange={(e) =>
                  handleChange(e, "options", `${qIndex}-${oIndex}`)
                }
              />
              <label>
                Correcte?
                <input
                  type="checkbox"
                  name="correcte"
                  checked={option.correcte}
                  onChange={(e) =>
                    handleChange(
                      { target: { name: "correcte", value: e.target.checked } },
                      "options",
                      `${qIndex}-${oIndex}`
                    )
                  }
                />
              </label>
            </div>
          ))}
          <button onClick={() => addOption(qIndex)}>Ajouter Option</button>
        </div>
      ))}

      <button onClick={addQuestion}>Ajouter une Question</button>
      <br />
      <button onClick={submitQuiz}>Enregistrer le Quiz</button>
    </div>
  );
};

export default QuizCreationPage;