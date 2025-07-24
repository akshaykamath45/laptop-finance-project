package com.akshay.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.akshay.demo.entity.Loan;
import com.akshay.demo.repository.LoanRepository;

@Service
public class LoanServiceImpl implements LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Override
    public Loan create(Loan loan) {
        return loanRepository.save(loan);
    }

    @Override
    public Loan read(String loanId) {
        return loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found: " + loanId));
    }

    @Override
    public List<Loan> readAll() {
        return loanRepository.findAll();
    }

    @Override
    public Loan update(Loan loan) {
        if (!loanRepository.existsById(loan.getLoanId())) {
            throw new RuntimeException("Loan not found: " + loan.getLoanId());
        }
        return loanRepository.save(loan);
    }

    @Override
    public void delete(String loanId) {
        loanRepository.deleteById(loanId);
    }

    @Override
    public List<Loan> getByCustomerId(String customerId) {
        return loanRepository.findByCustomerId(customerId);
    }
}

