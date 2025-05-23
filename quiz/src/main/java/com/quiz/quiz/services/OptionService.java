package com.quiz.quiz.services;

import com.quiz.quiz.models.Option;
import com.quiz.quiz.models.Question;
import com.quiz.quiz.repositories.OptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OptionService {

    @Autowired
    private OptionRepository optionRepository;

    public List<Option> getOptionsByQuestionId(Long questionId) {
        return optionRepository.findByQuestionId(questionId);
    }

    public Option createOption(Option option, Question question) {
        option.setQuestion(question);
        return optionRepository.save(option);
    }

    public void deleteOptionById(Long id) {
        optionRepository.deleteById(id);
    }

    public List<Option> saveAll(List<Option> options) {
        return optionRepository.saveAll(options);
    }
}