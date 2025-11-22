# Loan Application System - Spring Boot Backend

## Overview
Spring Boot REST API for loan eligibility checking with CIBIL score simulation.

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

## Project Structure
```
springboot-backend/
├── src/main/java/com/loanapp/
│   ├── LoanApplicationSystemApplication.java
│   ├── controller/
│   │   └── LoanController.java
│   ├── service/
│   │   └── LoanService.java
│   ├── model/
│   │   ├── LoanRequest.java
│   │   └── EligibilityResponse.java
│   └── exception/
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Setup Instructions

### 1. Create Spring Boot Project
You can use Spring Initializr (https://start.spring.io/) with these settings:
- Project: Maven
- Language: Java
- Spring Boot: 3.2.0 or later
- Packaging: Jar
- Java: 17

**Dependencies to add:**
- Spring Web
- Spring Boot DevTools
- Lombok (optional, for reducing boilerplate)

Or use the provided `pom.xml` in this directory.

### 2. Copy Files
Copy all the Java files from this directory to your Spring Boot project following the package structure above.

### 3. Configure Application
Edit `src/main/resources/application.properties` to set your preferred port and configurations.

### 4. Build and Run

```bash
# Navigate to project directory
cd springboot-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/loan-application-system-0.0.1-SNAPSHOT.jar
```

The server will start on `http://localhost:8080`

## API Endpoints

### Check Loan Eligibility
**POST** `/api/loan/checkEligibility`

**Request Body:**
```json
{
  "name": "John Doe",
  "loanAmount": 500000,
  "mobileNumber": "9876543210",
  "panNumber": "ABCDE1234F",
  "monthlyIncome": 50000
}
```

**Success Response (200 OK):**
```json
{
  "eligible": true,
  "cibilScore": 720,
  "maxEligibleAmount": 500000,
  "message": "Congratulations John Doe! You are eligible for a loan. You qualify for the full requested amount!"
}
```

**Error Response (400 Bad Request):**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid PAN number format. Please check and try again.",
  "path": "/api/loan/checkEligibility"
}
```

## Business Rules Implemented

### CIBIL Score Calculation
- Base score determined by monthly income brackets:
  - ₹100,000+: 800
  - ₹75,000-99,999: 750
  - ₹50,000-74,999: 700
  - ₹30,000-49,999: 650
  - ₹20,000-29,999: 600
  - Below ₹20,000: 550

- Adjusted by loan-to-income ratio
- Random variation (±20 points) for simulation

### Eligibility Rules
1. **CIBIL Score**: Must be ≥ 600
2. **Monthly Income**: Must be ≥ ₹20,000
3. **Maximum Loan**: Cannot exceed 5x annual income

### Loan Amount Calculation
- CIBIL ≥ 750: 100% of requested amount
- CIBIL 700-749: 90% of requested amount
- CIBIL 650-699: 75% of requested amount
- CIBIL 600-649: 50% of requested amount

## Validation Rules
- **PAN Format**: Must match pattern `[A-Z]{5}[0-9]{4}[A-Z]`
- **Mobile Number**: 10 digits
- **Loan Amount**: Must be > 0
- **Monthly Income**: Must be > 0
- **Name**: Cannot be empty

## Testing with cURL

```bash
# Test successful eligibility
curl -X POST http://localhost:8080/api/loan/checkEligibility \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "loanAmount": 500000,
    "mobileNumber": "9876543210",
    "panNumber": "ABCDE1234F",
    "monthlyIncome": 50000
  }'

# Test rejection - low income
curl -X POST http://localhost:8080/api/loan/checkEligibility \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "loanAmount": 500000,
    "mobileNumber": "9876543210",
    "panNumber": "ABCDE1234F",
    "monthlyIncome": 15000
  }'

# Test invalid PAN
curl -X POST http://localhost:8080/api/loan/checkEligibility \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "loanAmount": 300000,
    "mobileNumber": "9876543210",
    "panNumber": "INVALID",
    "monthlyIncome": 40000
  }'
```

## Connecting to React Frontend

### Option 1: Update React to use Spring Boot (port 8080)
In your React project, update the API endpoint in `src/components/LoanApplicationForm.tsx`:

```typescript
const response = await supabase.functions.invoke('check-loan-eligibility', {
  body: formData
});
// Change to:
const response = await fetch('http://localhost:8080/api/loan/checkEligibility', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
const data = await response.json();
```

### Option 2: Enable CORS in Spring Boot
The GlobalExceptionHandler already includes CORS configuration, but you can customize allowed origins in `LoanController.java`.

## Adding Your Own Functionalities

### Example: Add Database Support
1. Add JPA dependency to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. Create Entity:
```java
@Entity
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double loanAmount;
    private String panNumber;
    private Boolean eligible;
    private Integer cibilScore;
    private LocalDateTime createdAt;
    // getters, setters, constructors
}
```

3. Create Repository:
```java
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByPanNumber(String panNumber);
}
```

4. Update Service to save applications

### Example: Add Email Notification
1. Add Spring Mail dependency
2. Create EmailService
3. Call from LoanService after eligibility check

### Example: Add Authentication
1. Add Spring Security dependency
2. Configure JWT authentication
3. Protect endpoints with @PreAuthorize

## Common Issues

### Port Already in Use
Change port in `application.properties`:
```properties
server.port=8081
```

### CORS Errors
Ensure CORS is properly configured in controller or add global CORS configuration.

### Build Errors
Ensure Java 17+ and Maven are properly installed:
```bash
java -version
mvn -version
```

## Production Deployment
- Package as JAR: `mvn clean package`
- Deploy to cloud platforms (AWS, Azure, Heroku)
- Use environment variables for configuration
- Add proper logging and monitoring
- Implement rate limiting and security headers
