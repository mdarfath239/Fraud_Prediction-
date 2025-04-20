
import { Download, AlertTriangle, Check, Shield, Clock, CreditCard, BadgeAlert, ArrowDown } from "lucide-react";
import { PredictionResult, FlowChartFactor } from "../types";
import { formatTimeFromSeconds } from "@/lib/models";

interface AnalysisResultProps {
  result: PredictionResult;
  downloadResults: () => void;
  resetForm: () => void;
}

const AnalysisResult = ({ result, downloadResults, resetForm }: AnalysisResultProps) => {
  
  const getFlowChartFactors = () => {
    const factors: FlowChartFactor[] = [];
    
    if (result.features.time < 21600 || result.features.time > 64800) {
      factors.push({
        id: 'time',
        label: 'Unusual Time',
        icon: <Clock className="h-5 w-5" />,
        detail: `Transaction at ${formatTimeFromSeconds(result.features.time)}`,
        color: 'bg-amber-100 border-amber-200 text-amber-800'
      });
    }
    
    if (result.features.amount < 2 || result.features.amount > 10000) {
      factors.push({
        id: 'amount',
        label: 'Suspicious Amount',
        icon: <CreditCard className="h-5 w-5" />,
        detail: `$${result.features.amount.toFixed(2)} ${result.features.amount < 2 ? '(too low)' : '(too high)'}`,
        color: 'bg-red-100 border-red-200 text-red-800'
      });
    }
    
    const abnormalFeatures = Object.entries(result.features)
      .filter(([key, value]) => key.startsWith('V') && (value > 2.5 || value < -2.5))
      .slice(0, 3);
    
    if (abnormalFeatures.length > 0) {
      factors.push({
        id: 'features',
        label: 'Abnormal Features',
        icon: <BadgeAlert className="h-5 w-5" />,
        detail: `${abnormalFeatures.map(([k, v]) => `${k}: ${v.toFixed(2)}`).join(', ')}`,
        color: 'bg-purple-100 border-purple-200 text-purple-800'
      });
    }
    
    return factors;
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground text-right">
        Analysis time: {result.timestamp}
      </div>
      
      <div className="flex items-center justify-center p-6 rounded-xl border border-border bg-secondary/10 shadow-sm transform hover:scale-[1.01] transition-transform">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center h-14 w-14 rounded-full mb-3 transition-all ${
            result.prediction === "Fraud" 
              ? "bg-destructive/20 text-destructive" 
              : "bg-green-100 text-green-600"
          }`}>
            {result.prediction === "Fraud" ? (
              <AlertTriangle className="h-7 w-7" />
            ) : (
              <Check className="h-7 w-7" />
            )}
          </div>
          <h3 className="text-xl font-bold">
            {result.prediction}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Confidence: {isNaN(result.confidence) ? "100" : result.confidence}%
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Risk Level</h3>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div 
            className={`h-full ${
              result.risk === "Low" 
                ? "bg-green-500 w-1/2" 
                : "bg-red-500 w-full"
            }`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      {result.prediction === "Fraud" && (
        <div className="mt-6 mb-4">
          <h3 className="text-sm font-medium mb-3">Why This Transaction Is Flagged:</h3>
          <div className="relative">
            <div className="flex justify-center">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 shadow-md transform hover:translate-y-[-2px] transition-transform">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Transaction Analysis</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center my-2">
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {getFlowChartFactors().map((factor, index) => (
                <div key={factor.id} className="relative">
                  <div className={`rounded-lg border p-3 ${factor.color} shadow-md transform hover:translate-y-[-2px] transition-transform`}>
                    <div className="flex items-center space-x-2">
                      {factor.icon}
                      <span className="font-medium">{factor.label}</span>
                    </div>
                    <p className="text-xs mt-1">{factor.detail}</p>
                  </div>
                  
                  {index < getFlowChartFactors().length - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center my-2">
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex justify-center">
              <div className="rounded-lg border border-destructive bg-destructive/10 p-3 shadow-md transform hover:translate-y-[-2px] transition-transform">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">Fraud Detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {result.details.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Risk Factors</h3>
          <ul className="space-y-2 text-sm">
            {result.details.map((detail: string, index: number) => (
              <li key={index} className="flex items-start p-2 rounded-md border border-border bg-secondary/5 shadow-sm transform hover:translate-y-[-2px] transition-transform">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium mb-2">Key Features</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(result.features)
            .filter(([key]) => key === 'time' || key === 'amount' || key.startsWith('V'))
            .slice(0, 6)
            .map(([key, value]: [string, any]) => (
              <div 
                key={key} 
                className="p-2 rounded-md border border-border bg-secondary/5 shadow-sm transform hover:translate-y-[-2px] transition-transform"
              >
                <span className="text-xs text-muted-foreground">{key}:</span>
                <span className="ml-1 font-mono">
                  {key === 'time' 
                    ? formatTimeFromSeconds(value) 
                    : typeof value === 'number' 
                      ? Number(value.toFixed(4)) 
                      : value}
                </span>
              </div>
            ))}
        </div>
      </div>
      
      <div className="flex gap-4 pt-4">
        <button
          onClick={resetForm}
          className="flex-1 py-2 px-4 border border-input bg-background rounded-md font-medium text-sm transition-all hover:bg-secondary hover:shadow-sm"
        >
          New Analysis
        </button>
        <button
          onClick={downloadResults}
          className="flex-1 py-2 px-4 bg-primary/10 text-primary rounded-md font-medium text-sm flex items-center justify-center transition-all hover:bg-primary/20 hover:shadow-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
