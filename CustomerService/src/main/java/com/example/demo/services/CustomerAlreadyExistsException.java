package com.example.demo.services;

public class CustomerAlreadyExistsException extends RuntimeException {
    public CustomerAlreadyExistsException(String msg) {
        super(msg);
    }
}
