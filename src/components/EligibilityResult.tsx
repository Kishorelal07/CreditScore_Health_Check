import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, IndianRupee } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EligibilityResultProps {
  result: {
    eligible: boolean;
    cibilScore: number;
    maxEligibleAmount: number;
    message: string;
  };
}

export function EligibilityResult({ result }: EligibilityResultProps) {
  const { eligible, cibilScore, maxEligibleAmount, message } = result;

  // Determine CIBIL score range display
  const getCibilRange = (score: number) => {
    const lower = Math.max(300, score - 50);
    const upper = Math.min(900, score + 50);
    return `${lower} - ${upper}`;
  };

  // Get score status color
  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-success";
    if (score >= 650) return "text-primary";
    if (score >= 550) return "text-orange-600";
    return "text-destructive";
  };

  // Calculate progress percentage (300-900 scale)
  const scoreProgress = ((cibilScore - 300) / (900 - 300)) * 100;

  return (
    <Card className={`shadow-strong ${eligible ? "border-success/50" : "border-destructive/50"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            {eligible ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-success" />
                <span className="text-success">Eligible for Loan</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-destructive" />
                <span className="text-destructive">Not Eligible</span>
              </>
            )}
          </CardTitle>
          <Badge variant={eligible ? "default" : "destructive"} className="text-base px-4 py-1">
            {eligible ? "Approved" : "Declined"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-foreground">{message}</p>
        </div>

        {/* CIBIL Score Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold">CIBIL Score</span>
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(cibilScore)}`}>
              {cibilScore}
            </span>
          </div>
          
          <Progress value={scoreProgress} className="h-3" />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Poor (300)</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent (900)</span>
          </div>
          
          <div className="bg-accent/50 p-3 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Predicted Range: </span>
              <span className={getScoreColor(cibilScore)}>{getCibilRange(cibilScore)}</span>
            </p>
          </div>
        </div>

        {/* Max Eligible Amount Section */}
        {eligible && (
          <div className="space-y-3 p-4 bg-success/10 rounded-lg border border-success/30">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">Maximum Eligible Amount</span>
            </div>
            <p className="text-3xl font-bold text-success">
              ₹{maxEligibleAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-muted-foreground">
              This is the maximum loan amount you can receive based on your profile.
            </p>
          </div>
        )}

        {/* Score Explanation */}
        <div className="pt-4 border-t border-border">
          <h4 className="font-semibold mb-2 text-sm">Understanding Your Score:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• <span className="text-success">750-900:</span> Excellent - High approval chances</li>
            <li>• <span className="text-primary">650-749:</span> Good - Moderate approval chances</li>
            <li>• <span className="text-orange-600">550-649:</span> Fair - Limited options</li>
            <li>• <span className="text-destructive">Below 550:</span> Poor - Low approval chances</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
