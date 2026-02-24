package com.portfolio.repository;

import com.portfolio.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    // Spring Data JPA auto-implements: save(), findAll(), findById(), etc.
}
