package com.akshay.demo.entity;



import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@IdClass(EmiId.class)
@Table(name = "EMI")
public class EMI {

    @Id
    @Column(name = "LOAN_ID", length = 10)
    private String loanId;

    @Id
    @Column(name = "EMI_NUMBER")
    private int emiNumber;

    @Column(name = "EMI_DUE_DATE")
    private LocalDate emiDueDate;

    @Column(name = "EMI_PAID_DATE")
    private LocalDate emiPaidDate;

    @Column(name = "EMI_PAID_AMOUNT", precision = 10, scale = 2)
    private BigDecimal emiPaidAmount;

    @Column(name = "EMI_STATUS", length = 10)
    private String emiStatus;

    @Column(name = "PENALTY_APPLIED", length = 5)
    private String penaltyApplied;

    @Column(name = "PENALTY_AMOUNT", precision = 10, scale = 2)
    private BigDecimal penaltyAmount;

    public EMI() {}

    public String getLoanId() { return loanId; }
    public void setLoanId(String loanId) { this.loanId = loanId; }

    public int getEmiNumber() { return emiNumber; }
    public void setEmiNumber(int emiNumber) { this.emiNumber = emiNumber; }

    public LocalDate getEmiDueDate() { return emiDueDate; }
    public void setEmiDueDate(LocalDate emiDueDate) { this.emiDueDate = emiDueDate; }

    public LocalDate getEmiPaidDate() { return emiPaidDate; }
    public void setEmiPaidDate(LocalDate emiPaidDate) { this.emiPaidDate = emiPaidDate; }

    public BigDecimal getEmiPaidAmount() { return emiPaidAmount; }
    public void setEmiPaidAmount(BigDecimal emiPaidAmount) { this.emiPaidAmount = emiPaidAmount; }

    public String getEmiStatus() { return emiStatus; }
    public void setEmiStatus(String emiStatus) { this.emiStatus = emiStatus; }

    public String getPenaltyApplied() { return penaltyApplied; }
    public void setPenaltyApplied(String penaltyApplied) { this.penaltyApplied = penaltyApplied; }

    public BigDecimal getPenaltyAmount() { return penaltyAmount; }
    public void setPenaltyAmount(BigDecimal penaltyAmount) { this.penaltyAmount = penaltyAmount; }
}
