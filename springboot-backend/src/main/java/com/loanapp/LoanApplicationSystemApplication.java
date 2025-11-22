package com.loanapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application class for Loan Application System
 * 
 * This application provides REST APIs for:
 * - Loan eligibility checking
 * - CIBIL score simulation
 * - Loan amount calculation
 * 
 * @author Your Name
 * @version 1.0
 */
@SpringBootApplication
public class LoanApplicationSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoanApplicationSystemApplication.class, args);
        System.out.println("\n=================================================");
        System.out.println("Loan Application System Started Successfully!");
        System.out.println("API Base URL: http://localhost:8080/api/loan");
        System.out.println("=================================================\n");
    }
}
