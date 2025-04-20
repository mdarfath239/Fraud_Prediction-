import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { predictFraudWithDecisionTree, generateRandomVValues, formatTimeFromSeconds } from "@/lib/decision-tree-model";
import { PredictionResult } from "../fraud-detector/types";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Loader2, Download, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import TreeVisualization from "./components/TreeVisualization";
import DecisionTreeExplainer from "./components/DecisionTreeExplainer";

const DecisionTreePage = () => {
  const { toast } = useToast();
  const [time, setTime] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [vValues, setVValues] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [showDecisionPath, setShowDecisionPath] = useState(true);

  const generateVValues = () => {
    const newVValues = generateRandomVValues();
    setVValues(newVValues);
    toast({
      title: "Features Generated",
      description: "Random transaction features have been generated successfully.",
    });
  };

  const analyzeTransaction = () => {
    if (time === "" || amount === "") {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both time and amount values.",
      });
      return;
    }

    // Ensure we have vValues before analyzing
    let currentVValues = vValues;
    if (vValues.length === 0) {
      currentVValues = generateRandomVValues();
      setVValues(currentVValues);
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const predictionResult = predictFraudWithDecisionTree({
        time: time as number,
        amount: amount as number,
        vValues: currentVValues,
      });

      const resultWithTimestamp = {
        ...predictionResult,
        timestamp: new Date().toLocaleString(),
        id: Date.now().toString()
      };

      setResult(resultWithTimestamp);
      setPredictionHistory(prev => [resultWithTimestamp, ...prev]);
      setIsAnalyzing(false);

      toast({
        title: "Analysis Complete",
        description: `Transaction analyzed as: ${predictionResult.prediction}`,
        variant: predictionResult.prediction === "Fraud" ? "destructive" : "default",
      });
    }, 1500);
  };

  const resetForm = () => {
    setTime("");
    setAmount("");
    setVValues([]);
    setResult(null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setTime("");
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 86400) {
        setTime(numValue);
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAmount("");
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setAmount(numValue);
      }
    }
  };

  const downloadResults = () => {
    if (!result) return;

    const headers = ["Time", "Amount", "V12", "V14", "V17", "Prediction", "Confidence", "Decision Path", "Timestamp"];
    const data = `${time},${amount},${result.features.V12?.toFixed(6) || 0},${result.features.V14?.toFixed(6) || 0},${result.features.V17?.toFixed(6) || 0},"${result.prediction}",${result.confidence}%,"${result.details.join('; ')}","${result.timestamp}"`;
    const csvContent = `${headers.join(",")}\n${data}`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "decision_tree_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Results Downloaded",
      description: "The analysis results have been downloaded as a CSV file.",
    });
  };

  const deletePrediction = (id: string) => {
    setPredictionHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    if (result && result.id === id) {
      setResult(null);
    }
    
    toast({
      title: "Prediction Deleted",
      description: "The prediction has been removed from your history.",
    });
  };

  // Additional state for visualization and UI features
  const [showTreeDetails, setShowTreeDetails] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 pb-8 md:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Decision Tree Fraud Detection
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Use our decision tree algorithm to analyze and determine if a transaction is fraudulent based on key transaction features.
            </p>
            <div className="flex items-center bg-secondary/30 px-4 py-3 rounded-lg mb-8 text-sm">
              <Info className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              <p>Decision trees provide transparent, explainable fraud detection by analyzing transactions through a series of feature-based decisions.</p>
            </div>
            
            {/* Tree visualization section */}
            <div className="mb-6 bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Decision Tree Model</h2>
                <button 
                  onClick={() => setShowTreeDetails(!showTreeDetails)}
                  className="text-sm text-primary flex items-center"
                >
                  {showTreeDetails ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show Details
                    </>
                  )}
                </button>
              </div>
              
              <TreeVisualization 
                transactionData={result ? {
                  time: result.features.time as number,
                  amount: result.features.amount as number,
                  v12: result.features.V12 as number,
                  v14: result.features.V14 as number,
                  v17: result.features.V17 as number
                } : undefined}
                highlightPath={!!result}
              />
              
              {showTreeDetails && <DecisionTreeExplainer />}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
                <h2 className="text-xl font-semibold mb-6">Transaction Information</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="time" className="text-sm font-medium">
                      Transaction Time (in seconds, 0-86400)
                    </label>
                    <input
                      id="time"
                      type="number"
                      min="0"
                      max="86400"
                      value={time}
                      onChange={handleTimeChange}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Enter time (e.g. 3600 = 1 AM)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {time !== "" ? `Time: ${formatTimeFromSeconds(time as number)}` : "Enter time in seconds (0 = midnight, 43200 = noon)"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Transaction Amount ($)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Enter amount (e.g. 1.99)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Transaction Features</label>
                      <button
                        type="button"
                        onClick={generateVValues}
                        className="inline-flex items-center text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Generate Random
                      </button>
                    </div>
                    <div className="p-3 border border-input rounded-md bg-muted/40">
                      {vValues.length > 0 ? (
                        <>
                          <div className="text-xs text-muted-foreground mb-2">
                            Key transaction features (limited subset)
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>V12: {vValues[0]?.toFixed(6) || 0}</div>
                            <div>V14: {vValues[1]?.toFixed(6) || 0}</div>
                            <div>V17: {vValues[2]?.toFixed(6) || 0}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Click "Generate Random" to create transaction features
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={analyzeTransaction}
                    disabled={isAnalyzing}
                    className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <span className="inline-flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      "Analyze Transaction"
                    )}
                  </button>
                </div>
              </div>
              
              {/* Results Panel */}
              <div>
                {result ? (
                  <div className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold">Analysis Results</h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={downloadResults}
                          className="inline-flex items-center text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                        <button
                          onClick={resetForm}
                          className="inline-flex items-center text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          New Analysis
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${
                        result.prediction === "Fraud" 
                          ? "bg-destructive/15 border border-destructive/30" 
                          : "bg-primary/15 border border-primary/30"
                      }`}>
                        <h3 className="text-lg font-bold mb-1">
                          {result.prediction === "Fraud" ? "Fraudulent Transaction" : "Legitimate Transaction"}
                        </h3>
                        <p className="text-sm">
                          This transaction has been analyzed as{" "}
                          <span className="font-medium">
                            {result.prediction.toLowerCase()}
                          </span>{" "}
                          with{" "}
                          <span className="font-medium">{result.confidence}%</span> confidence.
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium">Decision Path</h3>
                          <button
                            onClick={() => setShowDecisionPath(!showDecisionPath)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showDecisionPath ? "Hide" : "Show"}
                          </button>
                        </div>
                        
                        {showDecisionPath && (
                          <div className="p-3 bg-muted/30 rounded-md text-xs space-y-1 max-h-48 overflow-y-auto">
                            {result.details.map((step, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <span className="text-[10px] font-medium">{i+1}</span>
                                </div>
                                <div>{step}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <h3 className="text-sm font-medium mb-2">Transaction Details</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                          <div className="text-muted-foreground">Time:</div>
                          <div>{formatTimeFromSeconds(time as number)}</div>
                          <div className="text-muted-foreground">Amount:</div>
                          <div>${amount}</div>
                          {result.features.V12 !== undefined && (
                            <>
                              <div className="text-muted-foreground">V12:</div>
                              <div>{result.features.V12.toFixed(6)}</div>
                            </>
                          )}
                          {result.features.V14 !== undefined && (
                            <>
                              <div className="text-muted-foreground">V14:</div>
                              <div>{result.features.V14.toFixed(6)}</div>
                            </>
                          )}
                          {result.features.V17 !== undefined && (
                            <>
                              <div className="text-muted-foreground">V17:</div>
                              <div>{result.features.V17.toFixed(6)}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background rounded-xl p-6 shadow-sm border border-border flex flex-col items-center justify-center text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <RefreshCw className="h-8 w-8 text-muted-foreground/70" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Enter transaction details and click "Analyze Transaction" to get started.
                    </p>
                  </div>
                )}
                
                {/* History Section */}
                {predictionHistory.length > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-medium">Recent Analyses</h3>
                    </div>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {predictionHistory.map((item) => (
                        <div 
                          key={item.id}
                          className={`p-3 rounded-lg border flex justify-between items-center text-sm ${
                            item.prediction === "Fraud" 
                              ? "border-destructive/30 bg-destructive/5" 
                              : "border-primary/30 bg-primary/5"
                          } hover:bg-opacity-75 transition-all cursor-pointer`}
                          onClick={() => setResult(item)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.prediction}</span>
                            <span className="text-xs text-muted-foreground">
                              ${amount} • {formatTimeFromSeconds(time as number)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-background">
                              {item.confidence}%
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePrediction(item.id);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DecisionTreePage;
