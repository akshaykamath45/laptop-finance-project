package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "EMPLOYER")
public class Employer {

    @Id
    @Column(name = "EMPLOYER_ID", nullable = false, length = 255)
    private String employerId;

    @Column(name = "EMPLOYER_NAME", length = 255)
    private String employerName;

    @Column(name = "EMPLOYMENT_TYPE", length = 255)
    private String employmentType;

    @Column(name = "MONTHLY_INCOME", nullable = false)
    private double monthlyIncome;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Customer> customers;

    public Employer() {}

    public Employer(String employerId, String employerName, String employmentType, double monthlyIncome) {
        this.employerId = employerId;
        this.employerName = employerName;
        this.employmentType = employmentType;
        this.monthlyIncome = monthlyIncome;
    }

    // Getters and setters
    public String getEmployerId() { return employerId; }
    public void setEmployerId(String employerId) { this.employerId = employerId; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public double getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(double monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public List<Customer> getCustomers() { return customers; }
    public void setCustomers(List<Customer> customers) { this.customers = customers; }
}


