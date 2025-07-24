package com.example.demo.controllers;

import com.example.demo.entity.Customer;
import com.example.demo.services.CustomerAlreadyExistsException;
import com.example.demo.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;


import java.util.List;

@RestController
@RequestMapping("/customer-db")
public class CustomerDBController {

    @Autowired
    private CustomerService customerService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addCustomer(@RequestBody Customer customer) {
        MyResponse response;
        try {
            customerService.create(customer);
            response = new MyResponse(customer, "Customer created successfully.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (CustomerAlreadyExistsException e) {
            response = new MyResponse(customer, e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable("id") String id) {
        try {
            Customer customer = customerService.read(id);
            MyResponse response = new MyResponse(customer, "Customer found.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MyResponse(null, e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/getByEmail/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable("email") String email) {
        try {
            Customer customer = customerService.findByEmail(email);
            MyResponse response = new MyResponse(customer, "Customer found by email.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new MyResponse(null, e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/getAll")
    public ResponseEntity<?> getAllCustomers() {
        List<Customer> customers = customerService.readAll();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

   
    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateCustomer(@RequestBody Customer customer) {
        try {
            Customer updated = customerService.update(customer);
            MyResponse response = new MyResponse(updated, "Customer updated successfully.");
            return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            return new ResponseEntity<>(new MyResponse(customer, e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable("id") String id) {
        try {
            customerService.delete(id);
            return new ResponseEntity<>(new MyResponse(null, "Customer deleted successfully."), HttpStatus.ACCEPTED);
        } catch (Exception e) {
            return new ResponseEntity<>(new MyResponse(null, e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
} 
