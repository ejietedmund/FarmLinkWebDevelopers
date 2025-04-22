package com.example.farmlink.repository;

import com.example.farmlink.model.Livestock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivestockRepository extends JpaRepository<Livestock, Long> {
}