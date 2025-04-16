package com.example.farmlink.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class FarmController {
    @GetMapping("/api")
    public String mainFarmView(){
        return "index.html";
    }
}
