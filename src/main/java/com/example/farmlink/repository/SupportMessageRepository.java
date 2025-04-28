package com.example.farmlink.repository;

import com.example.farmlink.model.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
}