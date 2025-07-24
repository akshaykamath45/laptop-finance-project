package com.example.demo.services;

import com.example.demo.entity.Customer;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public interface CustomerService {
    Customer create(Customer customer);
    Customer read(String customerId);
    List<Customer> readAll();
    Customer update(Customer customer);
    void delete(String customerId);
    Customer findByEmail(String email);

}