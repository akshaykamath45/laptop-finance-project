package com.example.demo.services;

public class CustomerNotExistsException extends RuntimeException {
    public CustomerNotExistsException(String msg) {
        super(msg);
    }
}
