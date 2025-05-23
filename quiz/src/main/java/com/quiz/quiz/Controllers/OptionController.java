package com.quiz.quiz.Controllers;

import com.quiz.quiz.models.Option;
import com.quiz.quiz.models.Question;
import com.quiz.quiz.services.OptionService;
import com.quiz.quiz.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
@CrossOrigin("*")
public class OptionController {

    @Autowired
    private OptionService optionService;
    @Autowired
    private QuestionService questionService;

    @PostMapping("/question/{questionId}")
    public ResponseEntity<List<Option>> createOptions(
            @PathVariable Long questionId,
            @RequestBody List<Option> options) {

        Question question = questionService.getQuestionById(questionId)
                .orElseThrow(() -> new RuntimeException("Question non trouvée"));

        for (Option opt : options) {
            opt.setQuestion(question);
        }

        List<Option> savedOptions = optionService.saveAll(options);
        return ResponseEntity.ok(savedOptions);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Long id) {
        optionService.deleteOptionById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Option>> getOptionsByQuestion(@PathVariable Long questionId) {
        List<Option> options = optionService.getOptionsByQuestionId(questionId);
        return ResponseEntity.ok(options);
    }
}