# Loan Eligibility Check Application

A full-stack application for checking loan eligibility with a React frontend and Spring Boot backend.

## Project Structure

```
loaneligibility-gateway/
├── src/                    # React frontend (TypeScript + Vite)
├── springboot-backend/     # Spring Boot REST API
└── ...
```

## Technologies Used

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Hook Form
- Zod (validation)

### Backend
- Spring Boot 3.2.0
- Java 17
- Maven

## Getting Started

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Java 17 or higher
- Maven 3.6+

### Frontend Setup

```sh
# Navigate to the project directory
cd loaneligibility-gateway

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```sh
# Navigate to the Spring Boot backend directory
cd loaneligibility-gateway/springboot-backend

# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend API will run on `http://localhost:8080`

## API Endpoints

- `POST /api/loan/checkEligibility` - Check loan eligibility
- `GET /api/loan/health` - Health check endpoint

## Development

The frontend is configured to proxy API requests to the Spring Boot backend running on port 8080. Make sure both servers are running for the full application to work.

## Building for Production

### Frontend
```sh
npm run build
```

### Backend
```sh
mvn clean package
```
