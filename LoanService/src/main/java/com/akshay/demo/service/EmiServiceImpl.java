package com.akshay.demo.service;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.akshay.demo.entity.EMI;
import com.akshay.demo.entity.EmiId;
import com.akshay.demo.repository.EmiRepository;

@Service
public class EmiServiceImpl implements EmiService {

    @Autowired
    private EmiRepository emiRepository;

    @Override
    public EMI create(EMI emi) {
        return emiRepository.save(emi);
    }

    @Override
    public List<EMI> getByLoanId(String loanId) {
        return emiRepository.findByLoanId(loanId);
    }

    @Override
    public void delete(String loanId, int emiNumber) {
        emiRepository.deleteById(new EmiId(loanId, emiNumber));
    }
    
    @Override
    public EMI payEmi(String loanId, int emiNumber, double amountPaid) {
        EMI emi = emiRepository.findByLoanIdAndEmiNumber(loanId, emiNumber)
                .orElseThrow(() -> new RuntimeException("EMI not found"));

        emi.setEmiPaidAmount(BigDecimal.valueOf(amountPaid)); // ✅ Correct type
        emi.setEmiPaidDate(LocalDate.now());
        emi.setEmiStatus("Paid");

        return emiRepository.save(emi);
    }

}
