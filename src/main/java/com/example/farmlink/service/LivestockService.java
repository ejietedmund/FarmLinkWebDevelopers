package com.example.farmlink.service;

import com.example.farmlink.model.Livestock;
import com.example.farmlink.repository.LivestockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivestockService {

    @Autowired
    private LivestockRepository livestockRepository;

    public void saveLivestock(Livestock livestock) {
        livestockRepository.save(livestock);
    }

    public List<Livestock> getAllLivestock() {
        return livestockRepository.findAll();
    }

    public List<Livestock> searchLivestock(String query) {
        return livestockRepository.findByNameOrTypeContaining(query);
    }

    public List<Livestock> getLivestockByType(String type) {
        return livestockRepository.findByTypeContaining(type);
    }
}