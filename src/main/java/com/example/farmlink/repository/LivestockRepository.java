package com.example.farmlink.repository;

import com.example.farmlink.model.Livestock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivestockRepository extends JpaRepository<Livestock, Long> {
    @Query("SELECT l FROM Livestock l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.type) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Livestock> findByNameOrTypeContaining(String query);

    @Query("SELECT l FROM Livestock l WHERE LOWER(l.type) LIKE LOWER(CONCAT('%', :type, '%'))")
    List<Livestock> findByTypeContaining(String type);
    List<Livestock> findByType(String type);
}