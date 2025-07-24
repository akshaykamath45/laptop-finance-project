package com.akshay.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.akshay.demo.entity.Laptop;
import com.akshay.demo.service.LaptopService;

import java.util.List;

@RestController
@RequestMapping("/laptop-db")
public class LaptopController {

    @Autowired
    private LaptopService laptopService;

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Laptop laptop) {
        return ResponseEntity.status(HttpStatus.CREATED).body(laptopService.addLaptop(laptop));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return ResponseEntity.ok(laptopService.getLaptop(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Laptop>> getAll() {
        return ResponseEntity.ok(laptopService.getAllLaptops());
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Laptop laptop) {
        return ResponseEntity.ok(laptopService.updateLaptop(laptop));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        laptopService.deleteLaptop(id);
        return ResponseEntity.ok("Laptop deleted successfully.");
    }
}
