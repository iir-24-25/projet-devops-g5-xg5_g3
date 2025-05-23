package com.quiz.quiz.repositories;

import com.quiz.quiz.Models.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByFirebaseUserId(String firebaseUserId);
    List<QuizResult> findByQuizId(Long quizId);
}