package com.akshay.demo.service;

import java.util.List;

import com.akshay.demo.entity.Loan;

public interface LoanService {
    Loan create(Loan loan);
    Loan read(String loanId);
    List<Loan> readAll();
    Loan update(Loan loan);
    void delete(String loanId);
    List<Loan> getByCustomerId(String customerId);
}