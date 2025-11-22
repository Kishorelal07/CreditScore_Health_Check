package com.loanapp.repository;

import com.loanapp.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for LoanEntity
 * Provides CRUD operations and custom query methods
 */
@Repository
public interface LoanEntityRepository extends JpaRepository<LoanEntity, Long> {
    
    /**
     * Find loan application by mobile number
     * @param mobileNumber Mobile number to search for
     * @return Optional LoanEntity
     */
    Optional<LoanEntity> findByMobileNumber(String mobileNumber);
    
    /**
     * Find loan application by PAN number
     * @param panNumber PAN number to search for
     * @return Optional LoanEntity
     */
    Optional<LoanEntity> findByPanNumber(String panNumber);
    
    /**
     * Find all loan applications by eligibility status
     * @param eligible Eligibility status
     * @return List of LoanEntity
     */
    List<LoanEntity> findByEligible(Boolean eligible);
    
    /**
     * Check if loan application exists by mobile number
     * @param mobileNumber Mobile number to check
     * @return true if exists, false otherwise
     */
    boolean existsByMobileNumber(String mobileNumber);
    
    /**
     * Check if loan application exists by PAN number
     * @param panNumber PAN number to check
     * @return true if exists, false otherwise
     */
    boolean existsByPanNumber(String panNumber);
}

