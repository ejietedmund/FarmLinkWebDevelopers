package com.example.farmlink.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;

@RestController
@RequestMapping("/send-email")
@CrossOrigin(origins = "http://localhost:8090")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Set a friendly "From" name and the authenticated SMTP user email
            helper.setFrom("ejiet.edmund@gmail.com", "FarmLink Support");
            // Set the "Reply-To" address
            helper.setReplyTo(emailRequest.getFrom());
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());

            // Format the email body based on the recipient type
            String bodyWithSignature;
            if ("BUYER".equalsIgnoreCase(emailRequest.getRecipientType())) {
                bodyWithSignature = "Dear Buyer,\n\n" +
                        "Thank you for your purchase on FarmLink:\n\n" +
                        "Details: " + emailRequest.getBody() + "\n\n" +
                        "If you have any questions, please contact the seller directly or reach out to us.\n\n" +
                        "Best regards,\n" +
                        "The FarmLink Team\n" +
                        "ejiet.edmund@gmail.com";
            } else {
                // Default to seller (or if recipientType is "SELLER")
                bodyWithSignature = "Dear Seller,\n\n" +
                        "You have received a new inquiry about your livestock listing on FarmLink:\n\n" +
                        "From: " + emailRequest.getFrom() + "\n" +
                        "Message: " + emailRequest.getBody() + "\n\n" +
                        "Please reply to the buyer directly using the email above.\n\n" +
                        "Best regards,\n" +
                        "The FarmLink Team\n" +
                        "ejiet.edmund@gmail.com";
            }
            helper.setText(bodyWithSignature, true);

            mailSender.send(message);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}

