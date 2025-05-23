package com.quiz.quiz.Controllers;

import com.quiz.quiz.models.Question;
import com.quiz.quiz.models.Quiz;
import com.quiz.quiz.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin("*")


public class QuizController {


    @Autowired
    private QuizService quizService;

    // Endpoint pour récupérer tous les quizzes
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // Endpoint pour récupérer un quiz par son id
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        Optional<Quiz> quizOptional = quizService.getQuizById(id);
        return quizOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint pour créer un quiz
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestParam("nom") String nom,
                                           @RequestParam("description") String description,
                                           @RequestParam("difficulte") String difficulte,
                                           @RequestParam("categorieId") Long categorieId,
                                           @RequestParam(value = "photo", required = false) MultipartFile photo) {
        try {
            Quiz quiz = quizService.createQuiz(nom, description, difficulte, categorieId, photo);
            return ResponseEntity.ok(quiz);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);  // Erreur serveur si l'upload échoue
        }
    }

    // End point pour mettre à jour un quiz
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id,
                                           @RequestParam("nom") String nom,
                                           @RequestParam("description") String description,
                                           @RequestParam("difficulte") String difficulte,
                                           @RequestParam("categorieId") Long categorieId,
                                           @RequestParam(value = "photo", required = false) MultipartFile photo) {
        try {
            Quiz quiz = quizService.updateQuiz(id, nom, description, difficulte, categorieId, photo);
            return ResponseEntity.ok(quiz);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);  // Erreur serveur si l'upload échoue
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // Quiz non trouvé
        }
    }

    // Endpoint pour supprimer un quiz
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.noContent().build();  // Suppression réussie
        } catch (Exception e) {
            return ResponseEntity.notFound().build();  // Quiz non trouvé
        }
    }

    // Endpoint pour obtenir le nombre total de quizzes
    @GetMapping("/count")
    public ResponseEntity<Long> getQuizCount() {
        try {
            long count = quizService.getQuizCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Erreur serveur
        }
    }



}