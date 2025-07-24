package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "CUSTOMER")  // uppercase to match Oracle default
public class Customer {

    @Id
    @Column(name = "CUSTOMER_ID", nullable = false, length = 255)
    private String customerId;

    @Column(name = "CUSTOMER_NAME", length = 255)
    private String customerName;

    @Column(name = "DOB")
    private LocalDate dob;

    @Column(name = "PHONE", length = 255)
    private String phone;

    @Column(name = "EMAIL", length = 255)
    private String email;

    @Column(name = "PAN_NUMBER", length = 255)
    private String panNumber;

    @Column(name = "AADHAR_NUMBER", length = 255)
    private String aadharNumber;

    @ManyToOne(fetch = FetchType.EAGER)  // eager fetch for serialization
    @JoinColumn(name = "EMPLOYER_ID")
    private Employer employer;

    @ManyToOne(fetch = FetchType.EAGER)  // eager fetch for serialization
    @JoinColumn(name = "LOCATION_ID")
    private Location location;

    public Customer() {}

    public Customer(String customerId, String customerName, LocalDate dob, String phone, String email,
                    String panNumber, String aadharNumber, Employer employer, Location location) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.panNumber = panNumber;
        this.aadharNumber = aadharNumber;
        this.employer = employer;
        this.location = location;
    }

    // Getters and Setters
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }

    public Employer getEmployer() { return employer; }
    public void setEmployer(Employer employer) { this.employer = employer; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    @Transient
    @JsonIgnore
    public String getCustomerInformation() {
        return "Customer [customerId=" + customerId +
                ", customerName=" + customerName +
                ", dob=" + dob +
                ", phone=" + phone +
                ", email=" + email +
                ", panNumber=" + panNumber +
                ", aadharNumber=" + aadharNumber +
                ", employerId=" + (employer != null ? employer.getEmployerId() : "null") +
                ", locationId=" + (location != null ? location.getLocationId() : "null") + "]";
    }
}
