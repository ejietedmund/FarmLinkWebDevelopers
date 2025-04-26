package com.example.farmlink.service;

import com.example.farmlink.model.Image;
import com.example.farmlink.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    public Image saveImage(Image image) {
        return imageRepository.save(image);
    }

    public Optional<Image> findByName(String name) {
        return imageRepository.findByName(name);
    }
}