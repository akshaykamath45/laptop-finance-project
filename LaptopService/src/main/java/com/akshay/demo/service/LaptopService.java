package com.akshay.demo.service;

import java.util.List;

import com.akshay.demo.entity.Laptop;

public interface LaptopService {
    Laptop addLaptop(Laptop laptop);
    Laptop getLaptop(String id);
    List<Laptop> getAllLaptops();
    Laptop updateLaptop(Laptop laptop);
    void deleteLaptop(String id);
}
