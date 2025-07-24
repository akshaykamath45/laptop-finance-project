package com.akshay.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;


import com.akshay.demo.entity.Loan;
import com.akshay.demo.service.LoanService;

@RestController
@RequestMapping("/loan-db")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/add")
    public ResponseEntity<?> addLoan(@RequestBody Loan loan) {
        try {
            Loan created = loanService.create(loan);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getLoan(@PathVariable("id") String loanId) {
        try {
            Loan loan = loanService.read(loanId);
            return ResponseEntity.status(HttpStatus.OK).body(loan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.readAll());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateLoan(@RequestBody Loan loan) {
        try {
            Loan updated = loanService.update(loan);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLoan(@PathVariable("id") String loanId) {
        try {
            loanService.delete(loanId);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Loan deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Loan>> getLoansByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(loanService.getByCustomerId(customerId));
    }
}
