// src/main/java/com/quiz/quiz/Controllers/UserController.java
package com.quiz.quiz.Controllers;

import com.google.firebase.auth.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class UserController {

    // Lister utilisateurs
    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        try {
            List<UserRecord> users = new ArrayList<>();
            ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);
            for (ExportedUserRecord user : page.iterateAll()) {
                users.add(user);
            }
            return ResponseEntity.ok(users);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Supprimer utilisateur
    @DeleteMapping("/users/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable String uid) {
        try {
            FirebaseAuth.getInstance().deleteUser(uid);
            return ResponseEntity.ok("Utilisateur supprimé");
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
