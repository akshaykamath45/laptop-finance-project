package com.akshay.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.akshay.demo.entity.EMI;
import com.akshay.demo.service.EmiService;

import java.util.List;

@RestController
@RequestMapping("/emi-db")
public class EmiController {

    @Autowired
    private EmiService emiService;

    @PostMapping("/add")
    public ResponseEntity<?> addEmi(@RequestBody EMI emi) {
        try {
            EMI created = emiService.create(emi);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/getByLoan/{loanId}")
    public ResponseEntity<List<EMI>> getByLoan(@PathVariable String loanId) {
        return ResponseEntity.ok(emiService.getByLoanId(loanId));
    }

    @DeleteMapping("/delete/{loanId}/{emiNumber}")
    public ResponseEntity<?> deleteEmi(@PathVariable String loanId, @PathVariable int emiNumber) {
        try {
            emiService.delete(loanId, emiNumber);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("EMI deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/pay/{loanId}/{emiNumber}")
    public ResponseEntity<?> payEmi(@PathVariable String loanId, @PathVariable int emiNumber, @RequestBody double amountPaid) {
        try {
            EMI updated = emiService.payEmi(loanId, emiNumber, amountPaid);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
