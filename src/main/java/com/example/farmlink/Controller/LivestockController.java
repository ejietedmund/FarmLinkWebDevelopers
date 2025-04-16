package com.example.farmlink.Controller;

import com.example.farmlink.Modal.LivestockModal;
import com.example.farmlink.Repository.LivestockRepository;
import com.example.farmlink.Service.LivestockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livestock")
@CrossOrigin(origins = "*")  //This allows quarying across all html pages
public class LivestockController {
    @Autowired
    private LivestockService livestockService;

    @GetMapping("/all")
    public List<LivestockModal> getAllLivestock(){
        return livestockService.getAllLivestock();
    }
    @GetMapping("/{type}")
    public List<LivestockModal> getByLivestockType(@PathVariable String type){
        return livestockService.getByLivestockType(type);
    }
    @GetMapping("/type/{Id}")
    public Optional<LivestockModal> getLivestockById(@PathVariable Long Id){
        return livestockService.getLivestockById(Id);
    }

    //receiving data from the html form and pushing it to the database
    @PostMapping("/save")
    public ResponseEntity<String> uploadImage (@RequestBody LivestockModal livestockModal){
        try {

            livestockService.saveLivestock(livestockModal);
            System.out.println("Received data: " + livestockModal.toString());
            return ResponseEntity.ok("imageUrl successfully uploaded");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save data.");
        }

    }

    @DeleteMapping("/delete/{id}")
    public void deleteLivestock(@PathVariable Long id){
        livestockService.deleteLivestock(id);
    }
}
