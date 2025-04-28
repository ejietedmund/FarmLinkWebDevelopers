package com.example.farmlink.service;

import com.example.farmlink.model.SupportMessage;
import com.example.farmlink.repository.SupportMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportMessageService {

    @Autowired
    private SupportMessageRepository supportMessageRepository;

    public void saveSupportMessage(SupportMessage message) {
        supportMessageRepository.save(message);
    }

    public List<SupportMessage> getAllSupportMessages() {
        return supportMessageRepository.findAll();
    }
}