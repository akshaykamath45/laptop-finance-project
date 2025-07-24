package com.akshay.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.akshay.demo.entity.EMI;
import com.akshay.demo.entity.EmiId;

@Repository
public interface EmiRepository extends JpaRepository<EMI, EmiId> {
    List<EMI> findByLoanId(String loanId);
    Optional<EMI> findByLoanIdAndEmiNumber(String loanId, int emiNumber);

}
