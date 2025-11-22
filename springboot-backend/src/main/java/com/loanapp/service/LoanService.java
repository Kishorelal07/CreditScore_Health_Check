package com.loanapp.service;

import com.loanapp.entity.LoanEntity;
import com.loanapp.model.LoanRequest;
import com.loanapp.model.EligibilityResponse;
import com.loanapp.repository.LoanEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

/**
 * Service class containing business logic for loan eligibility
 * Implements CIBIL score calculation and eligibility rules
 */
@Service
public class LoanService {
    
    private final Random random = new Random();
    private final LoanEntityRepository loanEntityRepository;
    
    @Autowired
    public LoanService(LoanEntityRepository loanEntityRepository) {
        this.loanEntityRepository = loanEntityRepository;
    }
    
    /**
     * Main method to check loan eligibility
     * Saves the loan application to the database
     * 
     * @param request LoanRequest containing user details
     * @return EligibilityResponse with eligibility determination
     */
    @Transactional
    public EligibilityResponse checkEligibility(LoanRequest request) {
        System.out.println("Processing loan eligibility for: " + request.getName());
        
        // Calculate CIBIL score based on income and loan amount
        int cibilScore = calculateCibilScore(request.getMonthlyIncome(), request.getLoanAmount());
        System.out.println("Calculated CIBIL score: " + cibilScore);
        
        // Create entity from request
        LoanEntity loanEntity = new LoanEntity(
            request.getName(),
            request.getLoanAmount(),
            request.getMobileNumber(),
            request.getPanNumber(),
            request.getMonthlyIncome()
        );
        loanEntity.setCibilScore(cibilScore);
        
        // Rule 1: Check minimum CIBIL score requirement (600)
        if (cibilScore < 600) {
            System.out.println("Rejected: CIBIL score below minimum threshold");
            loanEntity.setEligible(false);
            loanEntity.setMaxEligibleAmount(0.0);
            loanEntity.setMessage("Your credit score is below the minimum required threshold. Please improve your credit history and try again.");
            
            // Save to database
            loanEntityRepository.save(loanEntity);
            
            return new EligibilityResponse(
                false,
                cibilScore,
                0.0,
                loanEntity.getMessage()
            );
        }
        
        // Rule 2: Check minimum monthly income requirement (₹20,000)
        if (request.getMonthlyIncome() < 20000) {
            System.out.println("Rejected: Monthly income below minimum requirement");
            loanEntity.setEligible(false);
            loanEntity.setMaxEligibleAmount(0.0);
            loanEntity.setMessage("Your monthly income does not meet the minimum requirement of ₹20,000.");
            
            // Save to database
            loanEntityRepository.save(loanEntity);
            
            return new EligibilityResponse(
                false,
                cibilScore,
                0.0,
                loanEntity.getMessage()
            );
        }
        
        // Calculate maximum eligible amount based on CIBIL score
        double maxEligibleAmount;
        double eligibilityPercentage;
        
        if (cibilScore >= 750) {
            // Excellent score: Full amount eligible
            eligibilityPercentage = 1.0;
            maxEligibleAmount = request.getLoanAmount();
        } else if (cibilScore >= 700) {
            // Very Good score: 90% eligible
            eligibilityPercentage = 0.9;
            maxEligibleAmount = Math.floor(request.getLoanAmount() * 0.9);
        } else if (cibilScore >= 650) {
            // Good score: 75% eligible
            eligibilityPercentage = 0.75;
            maxEligibleAmount = Math.floor(request.getLoanAmount() * 0.75);
        } else {
            // Fair score: 50% eligible
            eligibilityPercentage = 0.5;
            maxEligibleAmount = Math.floor(request.getLoanAmount() * 0.5);
        }
        
        // Additional rule: Loan amount should not exceed 5x annual income
        double maxAffordableLoan = request.getMonthlyIncome() * 12 * 5;
        if (maxEligibleAmount > maxAffordableLoan) {
            maxEligibleAmount = maxAffordableLoan;
            eligibilityPercentage = maxAffordableLoan / request.getLoanAmount();
        }
        
        // Construct approval message
        String message = String.format("Congratulations %s! You are eligible for a loan.", request.getName());
        
        if (eligibilityPercentage < 1.0) {
            message += String.format(" Based on your credit profile, you can receive up to %.0f%% of the requested amount.",
                    eligibilityPercentage * 100);
        } else {
            message += " You qualify for the full requested amount!";
        }
        
        System.out.println("Approved: " + message);
        
        // Set entity fields and save to database
        loanEntity.setEligible(true);
        loanEntity.setMaxEligibleAmount(maxEligibleAmount);
        loanEntity.setMessage(message);
        
        // Save to database
        loanEntityRepository.save(loanEntity);
        System.out.println("Loan application saved to database with ID: " + loanEntity.getId());
        
        return new EligibilityResponse(
            true,
            cibilScore,
            maxEligibleAmount,
            message
        );
    }
    
    /**
     * Simulates CIBIL score calculation based on income and loan amount
     * In production, this would integrate with actual CIBIL API
     * 
     * @param monthlyIncome User's monthly income
     * @param loanAmount Requested loan amount
     * @return Calculated CIBIL score (300-900)
     */
    private int calculateCibilScore(double monthlyIncome, double loanAmount) {
        // Base score based on income brackets
        int baseScore;
        
        if (monthlyIncome >= 100000) {
            baseScore = 800;
        } else if (monthlyIncome >= 75000) {
            baseScore = 750;
        } else if (monthlyIncome >= 50000) {
            baseScore = 700;
        } else if (monthlyIncome >= 30000) {
            baseScore = 650;
        } else if (monthlyIncome >= 20000) {
            baseScore = 600;
        } else {
            baseScore = 550;
        }
        
        // Adjust score based on loan-to-income ratio
        double loanToIncomeRatio = loanAmount / (monthlyIncome * 12);
        
        if (loanToIncomeRatio > 3) {
            baseScore -= 50;
        } else if (loanToIncomeRatio > 2) {
            baseScore -= 30;
        } else if (loanToIncomeRatio < 1) {
            baseScore += 20;
        }
        
        // Add some randomness for simulation (-20 to +20)
        int randomAdjustment = random.nextInt(41) - 20;
        int finalScore = Math.max(300, Math.min(900, baseScore + randomAdjustment));
        
        return finalScore;
    }
}
