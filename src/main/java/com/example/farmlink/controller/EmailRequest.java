package com.example.farmlink.controller;

public class EmailRequest {
    private String from;
    private String to;
    private String subject;
    private String body;
    private String recipientType;

    // Getters and setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getRecipientType() { return recipientType; }
    public void setRecipientType(String recipientType) { this.recipientType = recipientType; }
}