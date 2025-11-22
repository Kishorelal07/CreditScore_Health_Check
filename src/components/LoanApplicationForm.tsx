import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, IndianRupee } from "lucide-react";
import { EligibilityResult } from "./EligibilityResult";

// Validation schema with proper PAN format and field validations
const loanFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  loanAmount: z.string()
    .trim()
    .min(1, { message: "Loan amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Loan amount must be a positive number"
    })
    .refine((val) => Number(val) >= 10000, {
      message: "Minimum loan amount is ₹10,000"
    })
    .refine((val) => Number(val) <= 10000000, {
      message: "Maximum loan amount is ₹1,00,00,000"
    }),
  mobileNumber: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number. Must be 10 digits starting with 6-9" }),
  panNumber: z.string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, { 
      message: "Invalid PAN format. Format: ABCDE1234F" 
    }),
  monthlyIncome: z.string()
    .trim()
    .min(1, { message: "Monthly income is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Monthly income must be a positive number"
    })
    .refine((val) => Number(val) >= 5000, {
      message: "Minimum monthly income is ₹5,000"
    }),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

interface EligibilityResponse {
  eligible: boolean;
  cibilScore: number;
  maxEligibleAmount: number;
  message: string;
}

export function LoanApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
  });

  const onSubmit = async (data: LoanFormData) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Call the Spring Boot backend API for eligibility check
      const response = await fetch('/api/loan/checkEligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          loanAmount: Number(data.loanAmount),
          mobileNumber: data.mobileNumber,
          panNumber: data.panNumber.toUpperCase(),
          monthlyIncome: Number(data.monthlyIncome),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to check eligibility' }));
        console.error('Error checking eligibility:', errorData);
        toast.error(errorData.message || 'Failed to check eligibility. Please try again.');
        return;
      }

      const responseData: EligibilityResponse = await response.json();
      setResult(responseData);
      
      if (responseData.eligible) {
        toast.success('Congratulations! You are eligible for the loan.');
      } else {
        toast.error(responseData.message || 'Unfortunately, you are not eligible for this loan.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-medium border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">Loan Application</CardTitle>
          <CardDescription>
            Fill in your details to check your loan eligibility instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name")}
                disabled={isLoading}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Loan Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="loanAmount"
                  type="text"
                  placeholder="Enter loan amount"
                  {...register("loanAmount")}
                  disabled={isLoading}
                  className={`pl-10 ${errors.loanAmount ? "border-destructive" : ""}`}
                />
              </div>
              {errors.loanAmount && (
                <p className="text-sm text-destructive">{errors.loanAmount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Min: ₹10,000 | Max: ₹1,00,00,000</p>
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                {...register("mobileNumber")}
                disabled={isLoading}
                maxLength={10}
                className={errors.mobileNumber ? "border-destructive" : ""}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
              )}
            </div>

            {/* PAN Number Field */}
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number *</Label>
              <Input
                id="panNumber"
                placeholder="Enter PAN (e.g., ABCDE1234F)"
                {...register("panNumber")}
                disabled={isLoading}
                maxLength={10}
                className={`uppercase ${errors.panNumber ? "border-destructive" : ""}`}
              />
              {errors.panNumber && (
                <p className="text-sm text-destructive">{errors.panNumber.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Format: 5 letters, 4 digits, 1 letter</p>
            </div>

            {/* Monthly Income Field */}
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="monthlyIncome"
                  type="text"
                  placeholder="Enter monthly income"
                  {...register("monthlyIncome")}
                  disabled={isLoading}
                  className={`pl-10 ${errors.monthlyIncome ? "border-destructive" : ""}`}
                />
              </div>
              {errors.monthlyIncome && (
                <p className="text-sm text-destructive">{errors.monthlyIncome.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Minimum: ₹5,000</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary-dark"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Eligibility...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Check Eligibility
                  </>
                )}
              </Button>
              {result && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Apply Again
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && <EligibilityResult result={result} />}
    </div>
  );
}
