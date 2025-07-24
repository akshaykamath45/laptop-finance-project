package com.akshay.demo.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "LOAN")
public class Loan {

    @Id
    @Column(name = "LOAN_ID", length = 10)
    private String loanId;

    @Column(name = "CUSTOMER_ID", nullable = false, length = 10)
    private String customerId;

    @Column(name = "LAPTOP_ID", nullable = false, length = 10)
    private String laptopId;

    @Column(name = "APPLICATION_DATE")
    private LocalDate applicationDate;

    @Column(name = "CONFIRMATION_DATE")
    private LocalDate confirmationDate;

    @Column(name = "LOAN_AMOUNT", precision = 10, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "INTEREST_RATE", precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "TENURE_MONTHS")
    private int tenureMonths;

    @Column(name = "EMI_AMOUNT", precision = 10, scale = 2)
    private BigDecimal emiAmount;

    @Column(name = "APPROVAL_STATUS", length = 20)
    private String approvalStatus;

    @Column(name = "REJECTION_REASON", length = 100)
    private String rejectionReason;

    @Column(name = "LOAN_ACTIVE", length = 5)
    private String loanActive;

    public Loan() {}

    public String getLoanId() { return loanId; }
    public void setLoanId(String loanId) { this.loanId = loanId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getLaptopId() { return laptopId; }
    public void setLaptopId(String laptopId) { this.laptopId = laptopId; }

    public LocalDate getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDate applicationDate) { this.applicationDate = applicationDate; }

    public LocalDate getConfirmationDate() { return confirmationDate; }
    public void setConfirmationDate(LocalDate confirmationDate) { this.confirmationDate = confirmationDate; }

    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public int getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(int tenureMonths) { this.tenureMonths = tenureMonths; }

    public BigDecimal getEmiAmount() { return emiAmount; }
    public void setEmiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getLoanActive() { return loanActive; }
    public void setLoanActive(String loanActive) { this.loanActive = loanActive; }
}