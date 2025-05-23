package com.quiz.quiz.services;

import com.quiz.quiz.models.Question;
import com.quiz.quiz.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question updateQuestion(Long id, Question updatedQuestion) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question non trouvée"));

        question.setEnonce(updatedQuestion.getEnonce());
        question.setType(updatedQuestion.getType());
        question.setPoints(updatedQuestion.getPoints());
        question.setExplication(updatedQuestion.getExplication());
        question.setQuiz(updatedQuestion.getQuiz());

        if (updatedQuestion.getOptions() != null) {
            updatedQuestion.getOptions().forEach(option -> option.setQuestion(question));
            question.setOptions(updatedQuestion.getOptions());
        }

        return questionRepository.save(question);
    }

    public Question saveQuestion(Question question) {
        if (question.getOptions() != null) {
            question.getOptions().forEach(option -> option.setQuestion(question));
        }
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }
}