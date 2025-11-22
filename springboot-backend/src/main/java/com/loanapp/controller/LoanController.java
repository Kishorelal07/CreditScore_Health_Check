package com.loanapp.controller;

import com.loanapp.model.LoanRequest;
import com.loanapp.model.EligibilityResponse;
import com.loanapp.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for loan-related operations
 * Handles HTTP requests for loan eligibility checking
 */
@RestController
@RequestMapping("/api/loan")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class LoanController {
    
    private final LoanService loanService;
    
    @Autowired
    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }
    
    /**
     * Endpoint to check loan eligibility
     * 
     * @param request LoanRequest object containing user details
     * @return EligibilityResponse with eligibility status, CIBIL score, and loan amount
     */
    @PostMapping("/checkEligibility")
    public ResponseEntity<EligibilityResponse> checkEligibility(
            @Valid @RequestBody LoanRequest request) {
        
        System.out.println("Received eligibility check request: " + request);
        
        // Process eligibility through service layer
        EligibilityResponse response = loanService.checkEligibility(request);
        
        System.out.println("Eligibility check completed: " + response);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Health check endpoint
     * 
     * @return Simple health status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Loan Application System is running!");
    }
}
