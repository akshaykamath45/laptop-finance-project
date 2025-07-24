package com.example.demo.controllers;

import com.example.demo.entity.Employer;
import com.example.demo.services.EmployerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employer-db")
public class EmployerDBController {

    @Autowired
    private EmployerService employerService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addEmployer(@RequestBody Employer employer) {
        MyResponse response;
        try {
            Employer created = employerService.create(employer);
            response = new MyResponse(created, "Employer added successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response = new MyResponse(employer, e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateEmployer(@RequestBody Employer updatedEmployer) {
        MyResponse response;
        try {
            Employer updated = employerService.update(updatedEmployer);
            response = new MyResponse(updated, "Employer updated successfully.");
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            response = new MyResponse(updatedEmployer, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployer(@PathVariable String id) {
        MyResponse response;
        try {
            employerService.delete(id);
            response = new MyResponse(null, "Employer deleted successfully.");
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            response = new MyResponse(null, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getEmployer(@PathVariable String id) {
        MyResponse response;
        try {
            Employer emp = employerService.read(id);
            response = new MyResponse(emp, "Employer found.");
            return ResponseEntity.status(HttpStatus.FOUND).body(response);
        } catch (Exception e) {
            response = new MyResponse(null, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllEmployers() {
        List<Employer> list = employerService.readAll();
        return ResponseEntity.ok(list);
    }
}
