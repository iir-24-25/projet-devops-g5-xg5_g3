package com.quiz.quiz.models;

import jakarta.persistence.*;

@Entity
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String texte;
    private boolean correcte;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTexte() { return texte; }
    public void setTexte(String texte) { this.texte = texte; }

    public boolean isCorrecte() { return correcte; }
    public void setCorrecte(boolean correcte) { this.correcte = correcte; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
}