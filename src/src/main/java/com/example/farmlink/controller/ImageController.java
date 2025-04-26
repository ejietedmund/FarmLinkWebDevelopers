package com.example.farmlink.controller;

import com.example.farmlink.model.Image;
import com.example.farmlink.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.sql.Timestamp;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    // Use an external directory for production
    private static final String UPLOAD_DIR = "/var/www/images/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("name") String name) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            // Check if the image already exists
            if (imageService.findByName(name).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Image with name " + name + " already exists");
            }

            // Create the upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Save the file to the filesystem
            String filePath = UPLOAD_DIR + name;
            File dest = new File(filePath);
            file.transferTo(dest);

            // Save the image metadata to the database
            Image image = new Image();
            image.setName(name);
            image.setFilePath(filePath);
            image.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            imageService.saveImage(image);

            return ResponseEntity.status(HttpStatus.CREATED).body("Image uploaded successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        }
    }

    @GetMapping("/{name}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String name) {
        try {
            Optional<Image> imageOptional = imageService.findByName(name);
            if (imageOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Image image = imageOptional.get();
            File file = new File(image.getFilePath());
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            FileSystemResource resource = new FileSystemResource(file);
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + name + "\"")
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}