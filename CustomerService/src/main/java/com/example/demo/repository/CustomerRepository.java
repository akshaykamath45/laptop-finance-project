package com.example.demo.repository;

import com.example.demo.entity.Customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    // You can add custom query methods here if needed
	Optional<Customer> findByEmail(String email);
}
