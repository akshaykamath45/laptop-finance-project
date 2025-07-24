package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestProjectApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(RestProjectApplication.class, args);
		System.out.println("Customer eureka client started...");
	}

}
