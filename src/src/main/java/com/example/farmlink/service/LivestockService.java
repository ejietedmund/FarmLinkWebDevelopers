package com.example.farmlink.service;

import com.example.farmlink.model.Livestock;
import com.example.farmlink.repository.LivestockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Optional<Livestock> getLivestockById(Long id) {
        return livestockRepository.findById(id);
    }

    public List<Livestock> searchLivestock(String query) {
        return livestockRepository.findByNameOrTypeContaining(query);
    }

    public List<Livestock> getLivestockByType(String type) {
        return livestockRepository.findByTypeContaining(type);
    }
}