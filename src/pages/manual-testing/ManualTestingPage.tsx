import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { 
  predictFraud,
} from "@/lib/models";
import ResultsPanel from "../fraud-detector/components/ResultsPanel";
import { PredictionResult } from "../fraud-detector/types";
import ManualEntryForm from "./components/ManualEntryForm";
import { Link } from "react-router-dom";
import { ScanBarcode } from "lucide-react";

const ManualTestingPage = () => {
  const { toast } = useToast();
  const [time, setTime] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [vValues, setVValues] = useState<number[]>(Array(28).fill(0));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);

  const analyzeTransaction = () => {
    if (time === "" || amount === "") {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both time and amount values.",
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const predictionResult = predictFraud({
        time: time as number,
        amount: amount as number,
        vValues,
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
    setVValues(Array(28).fill(0));
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
    link.setAttribute("download", "manual_test_results.csv");
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
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Manual Feature Testing
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter specific feature values to test the fraud detection system with known examples.
            </p>
            <div className="mt-4">
              <Link
                to="/detector"
                className="inline-flex items-center text-primary hover:underline"
              >
                <ScanBarcode className="h-4 w-4 mr-1.5" />
                Want random features? Try the standard Fraud Detector
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ManualEntryForm
              time={time}
              setTime={setTime}
              amount={amount}
              setAmount={setAmount}
              vValues={vValues}
              setVValues={setVValues}
              isAnalyzing={isAnalyzing}
              analyzeTransaction={analyzeTransaction}
            />
            
            <ResultsPanel 
              result={result}
              vValues={vValues}
              time={time}
              amount={amount}
              predictionHistory={predictionHistory}
              downloadResults={downloadResults}
              resetForm={resetForm}
              deletePrediction={deletePrediction}
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ManualTestingPage; 