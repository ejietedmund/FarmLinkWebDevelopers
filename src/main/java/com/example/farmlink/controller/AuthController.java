package com.example.farmlink.controller;

import com.example.farmlink.dto.UserDTO;
import com.example.farmlink.dto.LoginDTO;
import com.example.farmlink.model.User;
import com.example.farmlink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        try {
            // Log the incoming UserDTO for debugging
            System.out.println("UserDTO: " + userDTO.getFullName() + ", " + userDTO.getUsername() + ", " + userDTO.getEmail() + ", " + userDTO.getPhoneNumber() + ", " + userDTO.getLocation() + ", " + userDTO.getPassword());

            // Validate input
            if (userDTO.getFullName() == null || userDTO.getUsername() == null || userDTO.getEmail() == null ||
                    userDTO.getPhoneNumber() == null || userDTO.getLocation() == null || userDTO.getPassword() == null) {
                return ResponseEntity.status(400).body("All fields are required");
            }

            // Check if username or email already exists
            if (userService.existsByUsername(userDTO.getUsername())) {
                return ResponseEntity.status(400).body("Username already exists");
            }
            if (userService.existsByEmail(userDTO.getEmail())) {
                return ResponseEntity.status(400).body("Email already exists");
            }

            // Create user entity
            User user = new User();
            user.setFullName(userDTO.getFullName());
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setPhoneNumber(userDTO.getPhoneNumber());
            user.setLocation(userDTO.getLocation());
            user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            // Log the user object before saving
            System.out.println("User before save: " + user.getPassword());

            // Save user with plain text password
            userService.saveUser(user, userDTO.getPassword());

            return ResponseEntity.status(201).body("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDTO loginDTO) {
        try {
            // Validate input
            if (loginDTO.getUsername() == null || loginDTO.getPassword() == null) {
                return ResponseEntity.status(400).body("Username and password are required");
            }

            // Find the user by username
            Optional<User> userOptional = userService.findByUsername(loginDTO.getUsername());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid username or password");
            }

            User user = userOptional.get();

            // Compare the provided password with the stored password (plain text)
            if (!loginDTO.getPassword().equals(user.getPassword())) {
                return ResponseEntity.status(401).body("Invalid username or password");
            }

            // Login successful
            return ResponseEntity.ok("Login successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error logging in: " + e.getMessage());
        }
    }
}