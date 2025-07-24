package com.akshay.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.akshay.demo.entity.Loan;

@Repository
public interface LoanRepository extends JpaRepository<Loan, String> {
    List<Loan> findByCustomerId(String customerId);
}