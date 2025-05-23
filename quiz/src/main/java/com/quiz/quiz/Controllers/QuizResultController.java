package com.quiz.quiz.Controllers;

import com.quiz.quiz.Models.QuizResult;
import com.quiz.quiz.models.Quiz;
import com.quiz.quiz.services.QuizResultService;
import com.quiz.quiz.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quiz-results")
@CrossOrigin("*")
public class QuizResultController {

    @Autowired
    private QuizResultService quizResultService;

    @Autowired
    private QuizService quizService;

    // Submit new quiz result
    @PostMapping
    public QuizResult createQuizResult(@RequestBody QuizResult quizResult) {
        return quizResultService.saveQuizResult(quizResult);
    }

    // Get all results enriched with quiz name
    @GetMapping
    public List<QuizResult> getAllResults() {
        return quizResultService.getAllResults().stream().map(result -> {
            try {
                Optional<Quiz> quizOpt = quizService.getQuizById(result.getQuizId());
                if (quizOpt.isPresent()) {
                    result.setQuizName(quizOpt.get().getNom()); // getNom() is the quiz name field
                } else {
                    result.setQuizName("Unknown Quiz");
                }
            } catch (Exception e) {
                result.setQuizName("Unknown Quiz");
            }
            return result;
        }).toList();
    }

    // Get by Firebase User ID
    @GetMapping("/user/{firebaseUserId}")
    public List<QuizResult> getResultsByFirebaseUserId(@PathVariable String firebaseUserId) {
        List<QuizResult> results = quizResultService.getResultsByFirebaseUserId(firebaseUserId);

        return results.stream().map(result -> {
            try {
                Optional<Quiz> quizOpt = quizService.getQuizById(result.getQuizId());
                if (quizOpt.isPresent()) {
                    result.setQuizName(quizOpt.get().getNom());
                } else {
                    result.setQuizName("Unknown Quiz");
                }
            } catch (Exception e) {
                result.setQuizName("Unknown Quiz");
            }
            return result;
        }).toList();
    }
}