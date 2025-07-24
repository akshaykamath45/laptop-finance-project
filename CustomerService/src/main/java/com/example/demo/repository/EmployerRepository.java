package com.example.demo.repository;

import com.example.demo.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, String> {
    // You can add custom query methods here if needed
}
