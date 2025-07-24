package com.example.demo.services;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Employer;
import com.example.demo.entity.Location;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.EmployerRepository;
import com.example.demo.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private EmployerRepository employerRepo;

    @Autowired
    private LocationRepository locationRepo;

    @Override
    public Customer create(Customer customer) {
        if (customerRepo.existsById(customer.getCustomerId())) {
            throw new CustomerAlreadyExistsException("Customer already exists with ID: " + customer.getCustomerId());
        }

        // Link existing employer (if present)
        if (customer.getEmployer() != null && customer.getEmployer().getEmployerId() != null) {
            String empId = customer.getEmployer().getEmployerId();
            Employer employer = employerRepo.findById(empId)
                    .orElseThrow(() -> new RuntimeException("Employer not found with ID: " + empId));
            customer.setEmployer(employer);
        }

        // Link existing location (if present)
        if (customer.getLocation() != null && customer.getLocation().getLocationId() != null) {
            String locId = customer.getLocation().getLocationId();
            Location location = locationRepo.findById(locId)
                    .orElseThrow(() -> new RuntimeException("Location not found with ID: " + locId));
            customer.setLocation(location);
        }

        return customerRepo.save(customer);
    }

    @Override
    public Customer read(String customerId) {
        return customerRepo.findById(customerId)
                .orElseThrow(() -> new CustomerNotExistsException("Customer not found: " + customerId));
    }
    
    @Override
    public Customer findByEmail(String email) {
        return customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer with email " + email + " not found."));
    }


    @Override
    public List<Customer> readAll() {
        return customerRepo.findAll();
    }

    @Override
    public Customer update(Customer customer) {
        if (!customerRepo.existsById(customer.getCustomerId())) {
            throw new CustomerNotExistsException("Customer not found: " + customer.getCustomerId());
        }

        // Refresh employer/location links (if provided)
        if (customer.getEmployer() != null && customer.getEmployer().getEmployerId() != null) {
            Employer employer = employerRepo.findById(customer.getEmployer().getEmployerId())
                    .orElseThrow(() -> new RuntimeException("Employer not found: " + customer.getEmployer().getEmployerId()));
            customer.setEmployer(employer);
        }

        if (customer.getLocation() != null && customer.getLocation().getLocationId() != null) {
            Location location = locationRepo.findById(customer.getLocation().getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found: " + customer.getLocation().getLocationId()));
            customer.setLocation(location);
        }

        return customerRepo.save(customer);
    }

    @Override
    public void delete(String customerId) {
        if (!customerRepo.existsById(customerId)) {
            throw new CustomerNotExistsException("Customer not found: " + customerId);
        }
        customerRepo.deleteById(customerId);
    }
}

