package com.example.farmlink.Modal;

import jakarta.persistence.*;
import lombok.*;


@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class LivestockModal {
    //setter and getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //others
    private String name;
    private String description;
    private String type;
    private int price;
    private String location;
    private String contact;

    private String imageUrl;

    //constructor


    public LivestockModal(String name, String description, String type, int price, String location, String contact, String imageUrl) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.price = price;
        this.location = location;
        this.contact = contact;
        this.imageUrl = imageUrl;
    }
    //

}
