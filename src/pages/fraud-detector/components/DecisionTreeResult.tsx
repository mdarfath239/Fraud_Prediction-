import { GitBranch, AlertTriangle, Check, GitFork, Network, BadgeDollarSign, Clock } from "lucide-react";
import { PredictionResult } from "../types";
import { formatTimeFromSeconds } from "@/lib/models";

interface DecisionTreeResultProps {
  result: PredictionResult;
  downloadResults: () => void;
  resetForm: () => void;
}

const DecisionTreeResult = ({ result, downloadResults, resetForm }: DecisionTreeResultProps) => {
  // Extract key decision points from the details
  const getDecisionPoints = () => {
    const timeDecision = result.details.find(d => d.includes("time") || d.includes("Time"));
    const amountDecision = result.details.find(d => d.includes("amount") || d.includes("Amount"));
    const v12Decision = result.details.find(d => d.includes("V12"));
    const v14Decision = result.details.find(d => d.includes("V14"));
    const v17Decision = result.details.find(d => d.includes("V17"));
    
    return {
      timeDecision,
      amountDecision,
      v12Decision,
      v14Decision,
      v17Decision
    };
  };

  const decisions = getDecisionPoints();
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground text-right">
        Analysis time: {result.timestamp}
      </div>
      
      {/* Decision Tree Result Header */}
      <div className="flex items-center justify-center p-6 rounded-xl border border-border bg-secondary/10 shadow-sm">
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
          <div className="flex items-center justify-center mt-1 text-sm">
            <GitBranch className="h-4 w-4 mr-1.5 text-primary" />
            <span>Decision Tree Confidence: {result.confidence}%</span>
          </div>
        </div>
      </div>
      
      {/* Decision Tree Visualization */}
      <div className="border border-border rounded-lg p-4 bg-white">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Network className="h-4 w-4 mr-1.5 text-primary" />
          Decision Tree Path
        </h3>
        
        <div className="relative">
          {/* Root node */}
          <div className="flex justify-center">
            <div className="relative rounded-lg border border-primary bg-primary/10 p-3 max-w-xs text-center">
              <span className="text-xs font-medium">Root</span>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <GitFork className="h-5 w-5 text-primary rotate-180" />
              </div>
            </div>
          </div>
          
          {/* Time decision */}
          <div className="mt-6">
            <div className="relative rounded-lg border border-blue-300 bg-blue-50 p-3 mx-auto max-w-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <div className="text-sm">
                  <span className="font-medium">Time Check</span>
                  <p className="text-xs mt-1">
                    {decisions.timeDecision || `Time: ${formatTimeFromSeconds(result.features.time as number)}`}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <GitFork className="h-5 w-5 text-blue-500 rotate-180" />
              </div>
            </div>
          </div>
          
          {/* Amount decision */}
          <div className="mt-6">
            <div className="relative rounded-lg border border-amber-300 bg-amber-50 p-3 mx-auto max-w-sm">
              <div className="flex items-center">
                <BadgeDollarSign className="h-4 w-4 text-amber-600 mr-2" />
                <div className="text-sm">
                  <span className="font-medium">Amount Check</span>
                  <p className="text-xs mt-1">
                    {decisions.amountDecision || `Amount: $${(result.features.amount as number).toFixed(2)}`}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <GitFork className="h-5 w-5 text-amber-500 rotate-180" />
              </div>
            </div>
          </div>
          
          {/* V-values decision */}
          {(decisions.v12Decision || decisions.v14Decision || decisions.v17Decision) && (
            <div className="mt-6">
              <div className="relative rounded-lg border border-purple-300 bg-purple-50 p-3 mx-auto max-w-sm">
                <div className="flex items-center">
                  <Network className="h-4 w-4 text-purple-600 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">Feature Check</span>
                    <div className="text-xs mt-1 space-y-1">
                      {decisions.v12Decision && <p>{decisions.v12Decision}</p>}
                      {decisions.v14Decision && <p>{decisions.v14Decision}</p>}
                      {decisions.v17Decision && <p>{decisions.v17Decision}</p>}
                      {!decisions.v12Decision && !decisions.v14Decision && !decisions.v17Decision && (
                        <>
                          {result.features.V12 !== undefined && <p>V12: {(result.features.V12 as number).toFixed(4)}</p>}
                          {result.features.V14 !== undefined && <p>V14: {(result.features.V14 as number).toFixed(4)}</p>}
                          {result.features.V17 !== undefined && <p>V17: {(result.features.V17 as number).toFixed(4)}</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <GitFork className="h-5 w-5 text-purple-500 rotate-180" />
                </div>
              </div>
            </div>
          )}
          
          {/* Final classification */}
          <div className="mt-6 mb-2">
            <div className={`relative rounded-lg border p-3 mx-auto max-w-xs text-center ${
              result.prediction === "Fraud"
                ? "border-red-400 bg-red-50"
                : "border-green-400 bg-green-50"
            }`}>
              <div className="flex items-center justify-center">
                {result.prediction === "Fraud" ? (
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                ) : (
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                )}
                <span className={`font-medium ${
                  result.prediction === "Fraud" ? "text-red-700" : "text-green-700"
                }`}>
                  {result.prediction} ({result.confidence}% confidence)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Features */}
      <div>
        <h3 className="text-sm font-medium mb-2">Key Features</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-md border border-border bg-secondary/5">
            <span className="text-xs text-muted-foreground">Time:</span>
            <span className="ml-1 font-mono">
              {formatTimeFromSeconds(result.features.time as number)}
            </span>
          </div>
          <div className="p-2 rounded-md border border-border bg-secondary/5">
            <span className="text-xs text-muted-foreground">Amount:</span>
            <span className="ml-1 font-mono">
              ${(result.features.amount as number).toFixed(2)}
            </span>
          </div>
          {result.features.V12 !== undefined && (
            <div className="p-2 rounded-md border border-border bg-secondary/5">
              <span className="text-xs text-muted-foreground">V12:</span>
              <span className="ml-1 font-mono">
                {(result.features.V12 as number).toFixed(4)}
              </span>
            </div>
          )}
          {result.features.V14 !== undefined && (
            <div className="p-2 rounded-md border border-border bg-secondary/5">
              <span className="text-xs text-muted-foreground">V14:</span>
              <span className="ml-1 font-mono">
                {(result.features.V14 as number).toFixed(4)}
              </span>
            </div>
          )}
          {result.features.V17 !== undefined && (
            <div className="p-2 rounded-md border border-border bg-secondary/5">
              <span className="text-xs text-muted-foreground">V17:</span>
              <span className="ml-1 font-mono">
                {(result.features.V17 as number).toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Buttons */}
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
          Export Results
        </button>
      </div>
    </div>
  );
};

export default DecisionTreeResult;
