package com.example.farmlink.Service;

import com.example.farmlink.Modal.LivestockModal;
import com.example.farmlink.Repository.LivestockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivestockService {
    @Autowired
    private LivestockRepository livestockRepository;
    public List<LivestockModal> getAllLivestock(){
        return livestockRepository.findAll();
    }
    public Optional<LivestockModal> getLivestockById(Long Id){
        return livestockRepository.findById(Id);
    }
    public List<LivestockModal> getByLivestockType(String type){
        return livestockRepository.findByType(type);
    }
    public void saveLivestock(LivestockModal livestockModal){
        livestockRepository.save(livestockModal);
    }
    public void updateLivestock(LivestockModal livestockModal){
        livestockRepository.save(livestockModal);
    }
    public void deleteLivestock(Long Id){
        livestockRepository.deleteById(Id);
    }
}
