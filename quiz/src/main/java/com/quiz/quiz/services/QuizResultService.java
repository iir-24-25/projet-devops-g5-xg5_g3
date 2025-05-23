package com.quiz.quiz.services;

import com.quiz.quiz.Models.QuizResult;
import com.quiz.quiz.repositories.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizResultService {

    @Autowired
    private QuizResultRepository quizResultRepository;

    public QuizResult saveQuizResult(QuizResult quizResult) {
        return quizResultRepository.save(quizResult);
    }

    public List<QuizResult> getResultsByFirebaseUserId(String firebaseUserId) {
        return quizResultRepository.findByFirebaseUserId(firebaseUserId);
    }

    public List<QuizResult> getResultsByQuizId(Long quizId) {
        return quizResultRepository.findByQuizId(quizId);
    }

    public List<QuizResult> getAllResults() {
        return quizResultRepository.findAll();
    }
}