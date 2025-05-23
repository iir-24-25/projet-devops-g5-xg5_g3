import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateQuestion = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({
    enonce: "",
    type: "",
    points: 0,
    explication: "",
    quizId: ""
  });

  useEffect(() => {
    // Charger les quizzes
    axios.get("http://localhost:9090/api/quizzes")
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      enonce: form.enonce,
      type: form.type,
      points: parseInt(form.points),
      explication: form.explication,
      quiz: {
        id: parseInt(form.quizId)
      }
    };
    axios.post("http://localhost:9090/api/questions", data)
      .then(res => {
        alert("Question créée !");
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la création !");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une Question</h2>
      <input name="enonce" placeholder="Enoncé" onChange={handleChange} required />
      <input name="type" placeholder="Type de question" onChange={handleChange} required />
      <input name="points" type="number" placeholder="Points" onChange={handleChange} required />
      <input name="explication" placeholder="Explication" onChange={handleChange} />
      <select name="quizId" onChange={handleChange} required>
        <option value="">Choisir un Quiz</option>
        {quizzes.map(q => (
          <option key={q.id} value={q.id}>{q.nom}</option>
        ))}
      </select>
      <button type="submit">Créer</button>
    </form>
  );
};

export default CreateQuestion;
