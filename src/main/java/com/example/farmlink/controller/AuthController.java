package com.example.farmlink.controller;

import com.example.farmlink.model.User;
import com.example.farmlink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8090")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userService.findByUsername(request.getUsername());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        User user = userOptional.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
        }

        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole()); // Include role in response
        response.put("message", "Login successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        // Validate username and email uniqueness
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(400).body("Username already exists");
        }
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(400).body("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setContact(request.getPhoneNumber());
        user.setLocation(request.getLocation());
        user.setRole("USER"); // Default role for new users

        try {
            userService.saveUser(user, request.getPassword());
            return ResponseEntity.ok("Registration successful");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Could not register user");
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String fullName;
        private String username;
        private String email;
        private String phoneNumber;
        private String location;
        private String password;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}