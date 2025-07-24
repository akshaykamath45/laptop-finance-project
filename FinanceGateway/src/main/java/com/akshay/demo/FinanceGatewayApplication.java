package com.akshay.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;


@SpringBootApplication
(exclude = { DataSourceAutoConfiguration.class })
public class FinanceGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinanceGatewayApplication.class, args);
		System.out.println("Bank API Gateway started...");
	}
	@Bean
	 public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() {
	  return factory -> factory.configureDefault(
	    id -> new Resilience4JConfigBuilder(id).circuitBreakerConfig(
	      CircuitBreakerConfig.ofDefaults()).build()
	    );
	 };

}
