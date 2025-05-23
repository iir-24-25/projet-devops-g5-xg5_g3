package com.quiz.quiz.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Question {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String enonce;
    private String type;
    private int points;
    private String explication;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options = new ArrayList<>();

    public void addOption(Option option) {
        options.add(option);
        option.setQuestion(this);
    }

    public void removeOption(Option option) {
        options.remove(option);
        option.setQuestion(null);
    }


    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEnonce() { return enonce; }
    public void setEnonce(String enonce) { this.enonce = enonce; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getExplication() { return explication; }
    public void setExplication(String explication) { this.explication = explication; }

    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }

    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) {
        this.options.clear();
        if (options != null) {
            this.options.addAll(options);
            options.forEach(option -> option.setQuestion(this));
        }
    }
}