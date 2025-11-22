package com.loanapp.model;

import jakarta.validation.constraints.*;

/**
 * DTO for loan application request
 * Contains all user input fields with validation constraints
 */
public class LoanRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Loan amount is required")
    @Positive(message = "Loan amount must be positive")
    @Min(value = 10000, message = "Minimum loan amount is ₹10,000")
    @Max(value = 10000000, message = "Maximum loan amount is ₹1,00,00,000")
    private Double loanAmount;
    
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number format")
    private String mobileNumber;
    
    @NotBlank(message = "PAN number is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$", message = "Invalid PAN number format")
    private String panNumber;
    
    @NotNull(message = "Monthly income is required")
    @Positive(message = "Monthly income must be positive")
    private Double monthlyIncome;
    
    // Constructors
    public LoanRequest() {
    }
    
    public LoanRequest(String name, Double loanAmount, String mobileNumber, 
                       String panNumber, Double monthlyIncome) {
        this.name = name;
        this.loanAmount = loanAmount;
        this.mobileNumber = mobileNumber;
        this.panNumber = panNumber;
        this.monthlyIncome = monthlyIncome;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Double getLoanAmount() {
        return loanAmount;
    }
    
    public void setLoanAmount(Double loanAmount) {
        this.loanAmount = loanAmount;
    }
    
    public String getMobileNumber() {
        return mobileNumber;
    }
    
    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
    
    public String getPanNumber() {
        return panNumber;
    }
    
    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }
    
    public Double getMonthlyIncome() {
        return monthlyIncome;
    }
    
    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    
    @Override
    public String toString() {
        return "LoanRequest{" +
                "name='" + name + '\'' +
                ", loanAmount=" + loanAmount +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", panNumber='" + panNumber.substring(0, 2) + "***" + '\'' +
                ", monthlyIncome=" + monthlyIncome +
                '}';
    }
}
