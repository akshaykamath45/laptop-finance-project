package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "LOCATION")
public class Location {

    @Id
    @Column(name = "LOCATION_ID", nullable = false, length = 255)
    private String locationId;

    @Column(name = "CITY", length = 255)
    private String city;

    @Column(name = "STATE", length = 255)
    private String state;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Customer> customers;

    public Location() {}

    public Location(String locationId, String city, String state) {
        this.locationId = locationId;
        this.city = city;
        this.state = state;
    }

    // Getters and setters
    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public List<Customer> getCustomers() { return customers; }
    public void setCustomers(List<Customer> customers) { this.customers = customers; }
}
