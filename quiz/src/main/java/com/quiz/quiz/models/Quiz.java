package com.quiz.quiz.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private String difficulte;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @Lob
    private byte[] photo;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDifficulte() {
        return difficulte;
    }

    public void setDifficulte(String difficulte) {
        this.difficulte = difficulte;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }


// @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
//   private List<Question> questions;
////
////    // + getters et setters
//  public List<Question> getQuestions() {
//     return questions;
//  }
//
//    public void setQuestions(List<Question> questions) {
//        this.questions = questions;
//    }


}