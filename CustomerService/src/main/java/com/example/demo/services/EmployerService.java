package com.example.demo.services;

import com.example.demo.entity.Employer;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public interface EmployerService {
    Employer create(Employer employer);
    Employer read(String employerId);
    List<Employer> readAll();
    Employer update(Employer employer);
    void delete(String employerId);
}