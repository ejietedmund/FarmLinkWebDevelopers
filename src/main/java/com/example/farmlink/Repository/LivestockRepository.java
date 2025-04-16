package com.example.farmlink.Repository;

import com.example.farmlink.Modal.LivestockModal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivestockRepository extends JpaRepository<LivestockModal,Long>{

    List<LivestockModal> findByType(String type);

}
