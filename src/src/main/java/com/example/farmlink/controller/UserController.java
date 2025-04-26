package com.example.farmlink.controller;

import com.example.farmlink.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:8090")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        try {
            // Hardcode a user for testing purposes
            User user = new User();
            user.setUsername("Edmund Ejiet");
            user.setEmail("ejietedmund327@gmail.com");
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Internal Server Error
        }
    }
}