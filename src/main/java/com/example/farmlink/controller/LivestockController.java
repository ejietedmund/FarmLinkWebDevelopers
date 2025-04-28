package com.example.farmlink.controller;

import com.example.farmlink.model.Image;
import com.example.farmlink.model.Livestock;
import com.example.farmlink.service.ImageService;
import com.example.farmlink.service.LivestockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.sql.Timestamp;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/livestock")
@CrossOrigin(origins = "http://localhost:8090")
public class LivestockController {

    @Autowired
    private LivestockService livestockService;

    @Autowired
    private ImageService imageService;

    private static final String UPLOAD_DIR = "/var/www/images/";

    @PostMapping("/save")
    public ResponseEntity<String> saveLivestock(@RequestBody LivestockRequest livestockRequest) {
        try {
            // Create the upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Decode the Base64 image
            String base64Image = livestockRequest.getImageUrl();
            if (base64Image == null || !base64Image.startsWith("data:image/")) {
                System.out.println("Invalid image data: " + base64Image);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid image data");
            }

            // Extract the Base64 data (remove the prefix like "data:image/jpeg;base64,")
            String[] parts = base64Image.split(",");
            String imageData = parts.length > 1 ? parts[1] : parts[0];
            byte[] decodedBytes = Base64.getDecoder().decode(imageData);

            // Determine the file extension from the Base64 prefix
            String extension = "jpeg"; // Default to jpeg
            if (parts[0].contains("png")) {
                extension = "png";
            } else if (parts[0].contains("jpg") || parts[0].contains("jpeg")) {
                extension = "jpeg";
            }

            // Generate a unique filename
            String fileName = "livestock_" + UUID.randomUUID().toString() + "." + extension;
            String filePath = UPLOAD_DIR + fileName;

            // Save the image to the filesystem
            FileOutputStream fos = new FileOutputStream(filePath);
            fos.write(decodedBytes);
            fos.close();

            // Save the image metadata to the images table
            Image image = new Image();
            image.setName(fileName);
            image.setFilePath(filePath);
            imageService.saveImage(image);

            // Create a new Livestock entity
            Livestock livestock = new Livestock();
            livestock.setType(livestockRequest.getType());
            livestock.setName(livestockRequest.getName());
            livestock.setImagePath(filePath);
            livestock.setLocation(livestockRequest.getLocation());
            livestock.setPrice(Double.parseDouble(livestockRequest.getPrice()));
            livestock.setQuantity(livestockRequest.getQuantity());
            livestock.setContact(livestockRequest.getContact());
            livestock.setDescription(livestockRequest.getDescription());
            livestock.setEmail(livestockRequest.getEmail());
            livestock.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            // Save to the database
            livestockService.saveLivestock(livestock);

            return ResponseEntity.status(HttpStatus.CREATED).body("Livestock saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving livestock: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Livestock>> getAllLivestock() {
        try {
            List<Livestock> livestockList = livestockService.getAllLivestock();
            System.out.println("Fetched all livestock: " + livestockList.size() + " items");
            return ResponseEntity.ok(livestockList);
        } catch (Exception e) {
            System.err.println("Error fetching all livestock: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livestock> getLivestockById(@PathVariable Long id) {
        try {
            Optional<Livestock> livestockOptional = livestockService.getLivestockById(id);
            if (livestockOptional.isEmpty()) {
                System.out.println("Livestock not found for ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            System.out.println("Fetched livestock with ID: " + id);
            return ResponseEntity.ok(livestockOptional.get());
        } catch (Exception e) {
            System.err.println("Error fetching livestock with ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateLivestock(
            @PathVariable Long id,
            @RequestBody LivestockRequest livestockRequest,
            @RequestHeader("Role") String role) {
        try {
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin role required");
            }

            Optional<Livestock> livestockOptional = livestockService.getLivestockById(id);
            if (livestockOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Livestock not found");
            }

            Livestock livestock = livestockOptional.get();
            livestock.setType(livestockRequest.getType());
            livestock.setName(livestockRequest.getName());
            livestock.setLocation(livestockRequest.getLocation());
            livestock.setPrice(Double.parseDouble(livestockRequest.getPrice()));
            livestock.setQuantity(livestockRequest.getQuantity());
            livestock.setContact(livestockRequest.getContact());
            livestock.setDescription(livestockRequest.getDescription());
            livestock.setEmail(livestockRequest.getEmail());

            // Handle image update if provided
            if (livestockRequest.getImageUrl() != null && livestockRequest.getImageUrl().startsWith("data:image/")) {
                String base64Image = livestockRequest.getImageUrl();
                String[] parts = base64Image.split(",");
                String imageData = parts.length > 1 ? parts[1] : parts[0];
                byte[] decodedBytes = Base64.getDecoder().decode(imageData);

                String extension = "jpeg";
                if (parts[0].contains("png")) {
                    extension = "png";
                } else if (parts[0].contains("jpg") || parts[0].contains("jpeg")) {
                    extension = "jpeg";
                }

                String fileName = "livestock_" + UUID.randomUUID().toString() + "." + extension;
                String filePath = UPLOAD_DIR + fileName;

                FileOutputStream fos = new FileOutputStream(filePath);
                fos.write(decodedBytes);
                fos.close();

                Image image = new Image();
                image.setName(fileName);
                image.setFilePath(filePath);
                imageService.saveImage(image);

                livestock.setImagePath(filePath);
            }

            livestockService.saveLivestock(livestock);
            return ResponseEntity.ok("Livestock updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating livestock: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLivestock(
            @PathVariable Long id,
            @RequestHeader("Role") String role) {
        try {
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Admin role required");
            }

            Optional<Livestock> livestockOptional = livestockService.getLivestockById(id);
            if (livestockOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Livestock not found");
            }

            livestockService.deleteLivestock(id);
            return ResponseEntity.ok("Livestock deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting livestock: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Livestock>> searchLivestock(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            System.out.println("Invalid search query: " + query);
            return ResponseEntity.badRequest().body(null);
        }
        try {
            List<Livestock> livestockList = livestockService.searchLivestock(query);
            System.out.println("Search results for query '" + query + "': " + livestockList.size() + " items");
            return ResponseEntity.ok(livestockList);
        } catch (Exception e) {
            System.err.println("Error searching livestock with query '" + query + "': " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/type")
    public ResponseEntity<List<Livestock>> getLivestockByType(@RequestParam String type) {
        if (type == null || type.trim().isEmpty()) {
            System.out.println("Invalid type parameter: " + type);
            return ResponseEntity.badRequest().body(null);
        }
        try {
            List<Livestock> livestockList = livestockService.getLivestockByType(type);
            System.out.println("Fetched livestock of type '" + type + "': " + livestockList.size() + " items");
            return ResponseEntity.ok(livestockList);
        } catch (Exception e) {
            System.err.println("Error fetching livestock of type '" + type + "': " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/images/{name}")
    public ResponseEntity<Resource> getImage(@PathVariable String name) {
        try {
            File file = new File(UPLOAD_DIR + name);
            if (!file.exists()) {
                System.out.println("Image not found: " + name);
                return ResponseEntity.notFound().build();
            }
            Resource resource = new FileSystemResource(file);
            System.out.println("Serving image: " + name);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            System.err.println("Error serving image " + name + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

class LivestockRequest {
    private String type;
    private String name;
    private String imageUrl;
    private String location;
    private String price;
    private Integer quantity;
    private String contact;
    private String description;
    private String email;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}