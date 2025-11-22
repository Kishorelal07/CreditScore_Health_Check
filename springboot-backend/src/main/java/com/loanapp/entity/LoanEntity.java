package com.loanapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA Entity for loan applications
 * Represents a loan application record in the database
 */
@Entity
@Table(name = "loan_applications")
public class LoanEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "loan_amount", nullable = false)
    private Double loanAmount;
    
    @Column(name = "mobile_number", nullable = false, length = 10, unique = true)
    private String mobileNumber;
    
    @Column(name = "pan_number", nullable = false, length = 10, unique = true)
    private String panNumber;
    
    @Column(name = "monthly_income", nullable = false)
    private Double monthlyIncome;
    
    @Column(name = "cibil_score")
    private Integer cibilScore;
    
    @Column(name = "eligible")
    private Boolean eligible;
    
    @Column(name = "max_eligible_amount")
    private Double maxEligibleAmount;
    
    @Column(name = "message", length = 500)
    private String message;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public LoanEntity() {
    }
    
    // Constructor with basic fields
    public LoanEntity(String name, Double loanAmount, String mobileNumber, 
                     String panNumber, Double monthlyIncome) {
        this.name = name;
        this.loanAmount = loanAmount;
        this.mobileNumber = mobileNumber;
        this.panNumber = panNumber;
        this.monthlyIncome = monthlyIncome;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Pre-persist callback to set timestamps
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    // Pre-update callback to update timestamp
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public Integer getCibilScore() {
        return cibilScore;
    }
    
    public void setCibilScore(Integer cibilScore) {
        this.cibilScore = cibilScore;
    }
    
    public Boolean getEligible() {
        return eligible;
    }
    
    public void setEligible(Boolean eligible) {
        this.eligible = eligible;
    }
    
    public Double getMaxEligibleAmount() {
        return maxEligibleAmount;
    }
    
    public void setMaxEligibleAmount(Double maxEligibleAmount) {
        this.maxEligibleAmount = maxEligibleAmount;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "LoanEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", loanAmount=" + loanAmount +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", panNumber='" + panNumber.substring(0, 2) + "***" + '\'' +
                ", monthlyIncome=" + monthlyIncome +
                ", cibilScore=" + cibilScore +
                ", eligible=" + eligible +
                ", maxEligibleAmount=" + maxEligibleAmount +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
