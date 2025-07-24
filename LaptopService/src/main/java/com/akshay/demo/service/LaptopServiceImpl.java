package com.akshay.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.akshay.demo.entity.Laptop;
import com.akshay.demo.repository.LaptopRepository;

import java.util.List;

@Service
public class LaptopServiceImpl implements LaptopService {

    @Autowired
    private LaptopRepository laptopRepository;

    @Override
    public Laptop addLaptop(Laptop laptop) {
        return laptopRepository.save(laptop);
    }

    @Override
    public Laptop getLaptop(String id) {
        return laptopRepository.findById(id).orElseThrow(() -> new RuntimeException("Laptop not found: " + id));
    }

    @Override
    public List<Laptop> getAllLaptops() {
        return laptopRepository.findAll();
    }

    @Override
    public Laptop updateLaptop(Laptop laptop) {
        if (!laptopRepository.existsById(laptop.getLaptopId())) {
            throw new RuntimeException("Laptop not found: " + laptop.getLaptopId());
        }
        return laptopRepository.save(laptop);
    }

    @Override
    public void deleteLaptop(String id) {
        if (!laptopRepository.existsById(id)) {
            throw new RuntimeException("Laptop not found: " + id);
        }
        laptopRepository.deleteById(id);
    }
}
