package com.akshay.demo.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.akshay.demo.entity.Laptop;

@Repository
public interface LaptopRepository extends JpaRepository<Laptop, String> {
}
