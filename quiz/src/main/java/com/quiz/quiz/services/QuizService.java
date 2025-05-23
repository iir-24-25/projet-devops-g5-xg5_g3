package com.quiz.quiz.services;

import com.quiz.quiz.models.Categorie;
//import com.quiz.quiz.models.Question;
import com.quiz.quiz.models.Quiz;
import com.quiz.quiz.repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
//import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    // Méthode pour récupérer tous les quizzes
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    // Méthode pour récupérer un quiz par son id
    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    // Méthode pour sauvegarder ou mettre à jour un quiz

    public Quiz save(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    // Méthode pour créer un quiz avec une photo (si présente)
    public Quiz createQuiz(String nom, String description, String difficulte, Long categorieId, MultipartFile photo) throws IOException {
        Quiz quiz = new Quiz();
        quiz.setNom(nom);
        quiz.setDescription(description);
        quiz.setDifficulte(difficulte);

        // Associer la catégorie ici (vous pouvez récupérer la catégorie depuis la base de données)
        // Categorie categorie = categorieService.getCategorieById(categorieId); // Assurez-vous d'avoir une méthode pour récupérer la catégorie
        Categorie categorie = new Categorie(); // C'est juste un placeholder, remplacez par la logique réelle
        categorie.setId(categorieId);
        quiz.setCategorie(categorie);

        // Ajouter la photo si elle existe
        if (photo != null && !photo.isEmpty()) {
            quiz.setPhoto(photo.getBytes());
        }

        return quizRepository.save(quiz);
    }

    // Méthode pour mettre à jour un quiz avec une photo (si présente)
    public Quiz updateQuiz(Long id, String nom, String description, String difficulte, Long categorieId, MultipartFile photo) throws IOException {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isPresent()) {
            Quiz quiz = quizOptional.get();
            quiz.setNom(nom);
            quiz.setDescription(description);
            quiz.setDifficulte(difficulte);

            // Mettre à jour la catégorie ici
            Categorie categorie = new Categorie();
            categorie.setId(categorieId); // Assurez-vous d'obtenir la catégorie réelle de la base de données
            quiz.setCategorie(categorie);

            // Ajouter ou modifier la photo si elle existe
            if (photo != null && !photo.isEmpty()) {
                quiz.setPhoto(photo.getBytes());
            }

            return quizRepository.save(quiz);
        } else {
            throw new RuntimeException("Quiz non trouvé pour l'id: " + id);
        }
    }

    // Méthode pour supprimer un quiz
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
    // Dans QuizService.java
    public long getQuizCount() {
        return quizRepository.count();
    }

//    public List<Question> getQuestionsByQuizId(Long quizId) {
//        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
//        if (optionalQuiz.isPresent()) {
//            return optionalQuiz.get().getQuestions();
//        }
//        return new ArrayList<>();
//    }
}