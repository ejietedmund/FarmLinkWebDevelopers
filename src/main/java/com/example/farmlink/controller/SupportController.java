package com.example.farmlink.controller;

import com.example.farmlink.model.SupportMessage;
import com.example.farmlink.service.SupportMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/support")
@CrossOrigin(origins = "http://localhost:8090")
public class SupportController {

    @Autowired
    private SupportMessageService supportMessageService;

    @Autowired
    private JavaMailSender mailSender;

    // Load the support email from application.properties
    @Value("${support.email:ejiet.edmund@gmail.com}")
    private String supportEmail;

    // Simple email validation regex
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
    );

    @PostMapping("/submit")
    public ResponseEntity<String> submitSupportMessage(@RequestBody SupportMessageRequest request) {
        try {
            // Validate request fields
            if (request.getFullName() == null || request.getFullName().trim().isEmpty() ||
                    request.getEmail() == null || request.getEmail().trim().isEmpty() ||
                    request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("All fields (fullName, email, message) are required.");
            }

            // Validate email format
            if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid email format.");
            }

            // Save the message to the database
            SupportMessage message = new SupportMessage(
                    request.getFullName(),
                    request.getEmail(),
                    request.getMessage()
            );
            supportMessageService.saveSupportMessage(message);

            // Attempt to send the email
            try {
                SimpleMailMessage email = new SimpleMailMessage();
                email.setTo(supportEmail);
                email.setReplyTo(request.getEmail());
                email.setSubject("New Support Message from FarmLink");
                email.setText(
                        "From: " + request.getFullName() + "\n" +
                                "Email: " + request.getEmail() + "\n" +
                                "Message: " + request.getMessage()
                );
                mailSender.send(email);
                System.out.println("Email sent successfully to " + supportEmail);
            } catch (Exception e) {
                // Log the email failure but don't fail the request
                System.err.println("Failed to send email to " + supportEmail + ": " + e.getMessage());
            }

            return ResponseEntity.ok("Message sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending message: " + e.getMessage());
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<SupportMessage>> getAllSupportMessages(
            @RequestHeader("Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        try {
            List<SupportMessage> messages = supportMessageService.getAllSupportMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

class SupportMessageRequest {
    private String fullName;
    private String email;
    private String message;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}