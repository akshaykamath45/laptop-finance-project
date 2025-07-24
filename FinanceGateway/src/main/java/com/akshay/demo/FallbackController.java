package com.akshay.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FallbackController {

    @GetMapping("/customerFallback")
    public String customerServiceFallback() {
        return "Customer service is taking longer than expected.\nPlease try again later.";
    }

    @GetMapping("/laptopFallback")
    public String laptopServiceFallback() {
        return "Laptop service is currently unavailable or slow.\nPlease try again shortly.";
    }

    @GetMapping("/loanFallback")
    public String loanServiceFallback() {
        return "Loan service is facing delays.\nPlease try again after some time.";
    }
}
