package com.akshay.demo.service;


import java.util.List;

import com.akshay.demo.entity.EMI;

public interface EmiService {
    EMI create(EMI emi);
    List<EMI> getByLoanId(String loanId);
    void delete(String loanId, int emiNumber);
    EMI payEmi(String loanId, int emiNumber, double amountPaid);

}
