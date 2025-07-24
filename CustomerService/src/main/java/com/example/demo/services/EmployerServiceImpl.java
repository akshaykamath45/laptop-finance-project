package com.example.demo.services;

import com.example.demo.entity.Employer;
import com.example.demo.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmployerServiceImpl implements EmployerService {

    @Autowired
    EmployerRepository employerRepo;

    @Override
    public Employer create(Employer employer) {
        if (employerRepo.existsById(employer.getEmployerId())) {
            throw new RuntimeException("Employer already exists with ID: " + employer.getEmployerId());
        }
        return employerRepo.save(employer);
    }

    @Override
    public Employer read(String employerId) {
        return employerRepo.findById(employerId).orElseThrow(() -> new RuntimeException("Employer not found: " + employerId));
    }

    @Override
    public List<Employer> readAll() {
        return employerRepo.findAll();
    }

    @Override
    public Employer update(Employer employer) {
        if (!employerRepo.existsById(employer.getEmployerId())) {
            throw new RuntimeException("Employer not found: " + employer.getEmployerId());
        }
        return employerRepo.save(employer);
    }

    @Override
    public void delete(String employerId) {
        if (!employerRepo.existsById(employerId)) {
            throw new RuntimeException("Employer not found: " + employerId);
        }
        employerRepo.deleteById(employerId);
    }
}