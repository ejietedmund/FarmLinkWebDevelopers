package com.example.farmlink.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/send-email")
    public String sendTestEmail() {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo("ejiet.edmund@gmail.com");
            email.setSubject("Test Email from FarmLink");
            email.setText("This is a test email to confirm the email configuration is working.");
            mailSender.send(email);
            return "Test email sent successfully";
        } catch (Exception e) {
            return "Error sending test email: " + e.getMessage();
        }
    }
}