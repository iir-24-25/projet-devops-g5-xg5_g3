package com.quiz.quiz.services;

import com.quiz.quiz.models.Categorie;
import com.quiz.quiz.repositories.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieService {
    @Autowired
    private CategorieRepository categorieRepository;
    
    public List<Categorie> findAll() {
        return categorieRepository.findAll();
    }

    public Categorie findById(Long id) {
        return categorieRepository.findById(id).orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
    }

    public Categorie save(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    public void delete(Long id) {
        categorieRepository.deleteById(id);
    }
}
