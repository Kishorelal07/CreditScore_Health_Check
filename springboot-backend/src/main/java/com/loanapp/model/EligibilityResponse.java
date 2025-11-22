package com.loanapp.model;

/**
 * DTO for loan eligibility response
 * Contains eligibility status, CIBIL score, and calculated loan amount
 */
public class EligibilityResponse {
    
    private boolean eligible;
    private int cibilScore;
    private double maxEligibleAmount;
    private String message;
    
    // Constructors
    public EligibilityResponse() {
    }
    
    public EligibilityResponse(boolean eligible, int cibilScore, 
                               double maxEligibleAmount, String message) {
        this.eligible = eligible;
        this.cibilScore = cibilScore;
        this.maxEligibleAmount = maxEligibleAmount;
        this.message = message;
    }
    
    // Getters and Setters
    public boolean isEligible() {
        return eligible;
    }
    
    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }
    
    public int getCibilScore() {
        return cibilScore;
    }
    
    public void setCibilScore(int cibilScore) {
        this.cibilScore = cibilScore;
    }
    
    public double getMaxEligibleAmount() {
        return maxEligibleAmount;
    }
    
    public void setMaxEligibleAmount(double maxEligibleAmount) {
        this.maxEligibleAmount = maxEligibleAmount;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    @Override
    public String toString() {
        return "EligibilityResponse{" +
                "eligible=" + eligible +
                ", cibilScore=" + cibilScore +
                ", maxEligibleAmount=" + maxEligibleAmount +
                ", message='" + message + '\'' +
                '}';
    }
}
