import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { 
  predictFraud, 
  generateRandomVValues
} from "@/lib/models";
import { predictFraudWithDecisionTree } from "@/lib/decision-tree-model";
import TransactionForm from "./components/TransactionForm";
import ResultsPanel from "./components/ResultsPanel";
import { PredictionResult } from "./types";
import { Link } from "react-router-dom";
import { ClipboardEdit, GitBranch, HelpCircle, Info } from "lucide-react";
import TreeVisualization from "../decision-tree-page/components/TreeVisualization";

type ModelType = 'standard' | 'decision-tree';

const FraudDetector = () => {
  const { toast } = useToast();
  const [time, setTime] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [vValues, setVValues] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>('standard');
  const [showDecisionPath, setShowDecisionPath] = useState(true);
  const [showTreeVisualization, setShowTreeVisualization] = useState(false);

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
      // Use the selected model for prediction
      const predictionResult = selectedModel === 'standard' 
        ? predictFraud({
            time: time as number,
            amount: amount as number,
            vValues: currentVValues,
          })
        : predictFraudWithDecisionTree({
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

  const downloadResults = () => {
    if (!result) return;

    const headers = ["Time", "Amount", ...Array.from({ length: 28 }, (_, i) => `V${i+1}`), "Prediction", "Confidence", "Timestamp"];
    const vValuesData = vValues.map(v => v.toFixed(8)).join(",");
    const data = `${time},${amount},${vValuesData},"${result.prediction}",${result.confidence}%,"${result.timestamp}"`;
    const csvContent = `${headers.join(",")}\n${data}`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fraud_detection_results.csv");
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 pb-8 md:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="i-lucide-arrow-left mr-1 h-4 w-4" />
                Back to Home
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Fraud Detection System
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Use our advanced machine learning models to detect potentially fraudulent transactions based on transaction data.
            </p>
            
            {/* Model Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-secondary/20 rounded-lg p-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <Info className="h-4 w-4 text-primary mr-2" />
                <p className="text-sm">Select a fraud detection model:</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedModel('standard')}
                  className={`px-4 py-2 text-sm rounded-md flex items-center ${selectedModel === 'standard' ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  Standard Model
                </button>
                <button
                  onClick={() => setSelectedModel('decision-tree')}
                  className={`px-4 py-2 text-sm rounded-md flex items-center ${selectedModel === 'decision-tree' ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  <GitBranch className="h-4 w-4 mr-1.5" />
                  Decision Tree
                </button>
              </div>
            </div>
            
            {selectedModel === 'decision-tree' && (
              <div className="mb-6 bg-background rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <GitBranch className="h-4 w-4 mr-1.5 text-primary" />
                    Decision Tree Model
                  </h3>
                  <button 
                    onClick={() => setShowTreeVisualization(!showTreeVisualization)}
                    className="text-xs text-primary"
                  >
                    {showTreeVisualization ? 'Hide Visualization' : 'Show Visualization'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Decision trees analyze transactions through a series of binary splits based on time, amount, and transaction features.
                </p>
                
                {showTreeVisualization && (
                  <div className="mt-4">
                    <TreeVisualization 
                      transactionData={result && selectedModel === 'decision-tree' ? {
                        time: result.features.time as number,
                        amount: result.features.amount as number,
                        v12: result.features.V12 as number,
                        v14: result.features.V14 as number,
                        v17: result.features.V17 as number
                      } : undefined}
                      highlightPath={!!result && selectedModel === 'decision-tree'}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/manual-testing"
                className="inline-flex items-center text-primary hover:underline"
              >
                <ClipboardEdit className="h-4 w-4 mr-1.5" />
                Need to test specific values? Try Manual Testing
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <TransactionForm
                time={time}
                setTime={setTime}
                amount={amount}
                setAmount={setAmount}
                vValues={vValues}
                isAnalyzing={isAnalyzing}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                generateVValues={generateVValues}
                analyzeTransaction={analyzeTransaction}
                isDecisionTree={selectedModel === 'decision-tree'}
              />
              
              <div className="mt-4 flex items-center justify-between">
                {selectedModel === 'decision-tree' && result && (
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="showPath" 
                      checked={showDecisionPath} 
                      onChange={() => setShowDecisionPath(!showDecisionPath)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="showPath" className="text-sm text-muted-foreground">
                      Show decision path
                    </label>
                  </div>
                )}
                <Link
                  to="/manual-testing"
                  className="inline-flex items-center text-sm text-primary hover:underline ml-auto"
                >
                  <ClipboardEdit className="h-3.5 w-3.5 mr-1.5" />
                  Advanced Manual Testing
                </Link>
              </div>
            </div>
            
            <ResultsPanel
              result={result}
              vValues={vValues}
              time={time}
              amount={amount}
              predictionHistory={predictionHistory}
              downloadResults={downloadResults}
              resetForm={resetForm}
              deletePrediction={deletePrediction}
              isDecisionTree={selectedModel === 'decision-tree'}
              showDecisionPath={showDecisionPath}
              toggleDecisionPath={() => setShowDecisionPath(!showDecisionPath)}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FraudDetector;
