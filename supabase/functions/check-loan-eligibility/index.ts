import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoanRequest {
  name: string;
  loanAmount: number;
  mobileNumber: string;
  panNumber: string;
  monthlyIncome: number;
}

interface EligibilityResponse {
  eligible: boolean;
  cibilScore: number;
  maxEligibleAmount: number;
  message: string;
}

/**
 * Simulates CIBIL score calculation based on income and loan amount
 * In production, this would integrate with actual CIBIL API
 */
function calculateCibilScore(monthlyIncome: number, loanAmount: number): number {
  console.log(`Calculating CIBIL score for income: ${monthlyIncome}, loan: ${loanAmount}`);
  
  // Base score based on income brackets
  let baseScore = 550;
  
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
  }
  
  // Adjust score based on loan-to-income ratio
  const loanToIncomeRatio = loanAmount / (monthlyIncome * 12);
  
  if (loanToIncomeRatio > 3) {
    baseScore -= 50;
  } else if (loanToIncomeRatio > 2) {
    baseScore -= 30;
  } else if (loanToIncomeRatio < 1) {
    baseScore += 20;
  }
  
  // Add some randomness for simulation (-20 to +20)
  const randomAdjustment = Math.floor(Math.random() * 41) - 20;
  const finalScore = Math.max(300, Math.min(900, baseScore + randomAdjustment));
  
  console.log(`Final CIBIL score: ${finalScore}`);
  return finalScore;
}

/**
 * Validates PAN number format
 */
function isValidPanFormat(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return panRegex.test(pan);
}

/**
 * Checks loan eligibility based on business rules
 */
function checkEligibility(request: LoanRequest): EligibilityResponse {
  console.log('Processing loan eligibility request:', {
    name: request.name,
    loanAmount: request.loanAmount,
    monthlyIncome: request.monthlyIncome,
    panNumber: request.panNumber.substring(0, 2) + '***' // Log masked PAN
  });

  // Validate PAN format
  if (!isValidPanFormat(request.panNumber)) {
    console.error('Invalid PAN format:', request.panNumber);
    return {
      eligible: false,
      cibilScore: 0,
      maxEligibleAmount: 0,
      message: "Invalid PAN number format. Please check and try again."
    };
  }

  // Calculate CIBIL score
  const cibilScore = calculateCibilScore(request.monthlyIncome, request.loanAmount);

  // Eligibility Rule 1: CIBIL score must be at least 600
  if (cibilScore < 600) {
    console.log('Rejected: CIBIL score too low');
    return {
      eligible: false,
      cibilScore,
      maxEligibleAmount: 0,
      message: "Your credit score is below the minimum required threshold. Please improve your credit history and try again."
    };
  }

  // Eligibility Rule 2: Monthly income must be at least ₹20,000
  if (request.monthlyIncome < 20000) {
    console.log('Rejected: Monthly income too low');
    return {
      eligible: false,
      cibilScore,
      maxEligibleAmount: 0,
      message: "Your monthly income does not meet the minimum requirement of ₹20,000."
    };
  }

  // Calculate maximum eligible amount based on CIBIL score
  let maxEligibleAmount = 0;
  let eligibilityPercentage = 1.0;

  if (cibilScore >= 750) {
    // Excellent score: Full amount eligible
    eligibilityPercentage = 1.0;
    maxEligibleAmount = request.loanAmount;
  } else if (cibilScore >= 700) {
    // Very Good score: 90% eligible
    eligibilityPercentage = 0.9;
    maxEligibleAmount = Math.floor(request.loanAmount * 0.9);
  } else if (cibilScore >= 650) {
    // Good score: 75% eligible
    eligibilityPercentage = 0.75;
    maxEligibleAmount = Math.floor(request.loanAmount * 0.75);
  } else if (cibilScore >= 600) {
    // Fair score: 50% eligible
    eligibilityPercentage = 0.5;
    maxEligibleAmount = Math.floor(request.loanAmount * 0.5);
  }

  // Additional check: Loan amount should not exceed 5x annual income
  const maxAffordableLoan = request.monthlyIncome * 12 * 5;
  if (maxEligibleAmount > maxAffordableLoan) {
    maxEligibleAmount = maxAffordableLoan;
    eligibilityPercentage = maxAffordableLoan / request.loanAmount;
  }

  console.log('Approved:', {
    cibilScore,
    maxEligibleAmount,
    eligibilityPercentage: `${(eligibilityPercentage * 100).toFixed(0)}%`
  });

  // Construct approval message
  let message = `Congratulations ${request.name}! You are eligible for a loan.`;
  
  if (eligibilityPercentage < 1.0) {
    message += ` Based on your credit profile, you can receive up to ${(eligibilityPercentage * 100).toFixed(0)}% of the requested amount.`;
  } else {
    message += ' You qualify for the full requested amount!';
  }

  return {
    eligible: true,
    cibilScore,
    maxEligibleAmount,
    message
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received eligibility check request');
    
    const requestData: LoanRequest = await req.json();

    // Validate required fields
    if (!requestData.name || !requestData.loanAmount || !requestData.mobileNumber || 
        !requestData.panNumber || !requestData.monthlyIncome) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          details: 'All fields (name, loanAmount, mobileNumber, panNumber, monthlyIncome) are required'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate numeric fields
    if (requestData.loanAmount <= 0 || requestData.monthlyIncome <= 0) {
      console.error('Invalid numeric values');
      return new Response(
        JSON.stringify({
          error: 'Invalid input',
          details: 'Loan amount and monthly income must be positive numbers'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Process eligibility
    const result = checkEligibility(requestData);

    console.log('Eligibility check completed successfully');
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing eligibility check:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: errorMessage
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
