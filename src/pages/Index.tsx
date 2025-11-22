import { LoanApplicationForm } from "@/components/LoanApplicationForm";
import { Building2, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-16 px-4 shadow-strong">
        <div className="max-w-6xl mx-auto text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Instant Loan Eligibility Check
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Get your loan eligibility status in seconds. Fast, secure, and transparent.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-card rounded-lg shadow-soft border border-border/50">
            <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
            <p className="text-sm text-muted-foreground">
              Get your eligibility status within seconds
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-soft border border-border/50">
            <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Secure Process</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and protected
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-soft border border-border/50">
            <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Trusted Service</h3>
            <p className="text-sm text-muted-foreground">
              Powered by advanced eligibility algorithms
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <LoanApplicationForm />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            * This is a demo system. CIBIL scores are simulated for demonstration purposes.
          </p>
          <p className="mt-2">
            Eligibility is calculated based on income, credit score, and loan amount.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
