import { RefreshCw, ArrowRight, Clipboard, Check } from "lucide-react";
import { 
  formatTimeFromSeconds,
  timeSuggestions,
  amountSuggestions
} from "@/lib/models";
import { useState } from "react";

// Example values from the provided dataset
const exampleValues = {
  v1: -1.359807,
  v2: -0.072781,
  v3: 2.536347,
  v4: 1.378155,
  v5: -0.338321,
  v6: 0.462388,
  v7: 0.239599,
  v8: 0.098698,
  v9: 0.363787,
  v10: 0.090794,
  v11: -0.551600,
  v12: -0.617801,
  v13: -0.991390,
  v14: -0.311169,
  v15: 1.468177,
  v16: -0.470400,
  v17: 0.207971,
  v18: 0.025791,
  v19: 0.403993,
  v20: 0.251412,
  v21: -0.018307,
  v22: 0.277838,
  v23: -0.110474,
  v24: 0.066928,
  v25: 0.128539,
  v26: -0.189115,
  v27: 0.133558,
  v28: -0.021053,
  time: 0,
  amount: 149.62
};

interface ManualEntryFormProps {
  time: number | "";
  setTime: (time: number | "") => void;
  amount: number | "";
  setAmount: (amount: number | "") => void;
  vValues: number[];
  setVValues: (values: number[]) => void;
  isAnalyzing: boolean;
  analyzeTransaction: () => void;
}

const ManualEntryForm = ({
  time,
  setTime,
  amount,
  setAmount,
  vValues,
  setVValues,
  isAnalyzing,
  analyzeTransaction
}: ManualEntryFormProps) => {
  const [copied, setCopied] = useState(false);
  
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

  const handleVValueChange = (index: number, value: string) => {
    const newValues = [...vValues];
    if (value === "") {
      newValues[index] = 0;
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        newValues[index] = numValue;
      }
    }
    setVValues(newValues);
  };

  const loadExampleValues = () => {
    setTime(exampleValues.time);
    setAmount(exampleValues.amount);
    
    const newVValues = [
      exampleValues.v1, 
      exampleValues.v2,
      exampleValues.v3,
      exampleValues.v4,
      exampleValues.v5,
      exampleValues.v6,
      exampleValues.v7,
      exampleValues.v8,
      exampleValues.v9,
      exampleValues.v10,
      exampleValues.v11,
      exampleValues.v12,
      exampleValues.v13,
      exampleValues.v14,
      exampleValues.v15,
      exampleValues.v16,
      exampleValues.v17,
      exampleValues.v18,
      exampleValues.v19,
      exampleValues.v20,
      exampleValues.v21,
      exampleValues.v22,
      exampleValues.v23,
      exampleValues.v24,
      exampleValues.v25,
      exampleValues.v26,
      exampleValues.v27,
      exampleValues.v28
    ];
    
    setVValues(newVValues);
    
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const resetValues = () => {
    setVValues(Array(28).fill(0));
  };

  return (
    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manual Feature Entry</h2>
        <button
          type="button"
          onClick={loadExampleValues}
          className="text-primary flex items-center text-sm bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Loaded Example
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-1.5" />
              Load Example Values
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="min-h-[2rem]">
              <label htmlFor="time" className="text-sm font-medium">
                Transaction Time
              </label>
            </div>
            <input
              id="time"
              type="number"
              min="0"
              max="86400"
              value={time}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder=""
            />
            <p className="text-xs text-muted-foreground min-h-[1rem]">
              {time !== "" ? `Time: ${formatTimeFromSeconds(time as number)}` : "Enter time in seconds"}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="min-h-[2rem]">
              <label htmlFor="amount" className="text-sm font-medium">
                Transaction Amount ($)
              </label>
            </div>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder=""
            />
            <p className="text-xs text-muted-foreground min-h-[1rem]">
              {amount !== "" ? `$${Number(amount).toFixed(2)}` : "Enter amount in dollars"}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Feature Values (V1-V28)
            </label>
            <button
              type="button"
              onClick={resetValues}
              className="text-xs text-muted-foreground flex items-center hover:text-primary"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset Features
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
            {vValues.map((value, index) => (
              <div key={index} className="space-y-1">
                <label htmlFor={`v${index+1}`} className="text-xs font-medium">
                  V{index+1}
                </label>
                <input
                  id={`v${index+1}`}
                  type="number"
                  step="0.000001"
                  value={value}
                  onChange={(e) => handleVValueChange(index, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="button"
            onClick={analyzeTransaction}
            disabled={isAnalyzing}
            className="w-full py-2 px-4 bg-primary text-white rounded-md font-medium flex items-center justify-center transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Transaction
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryForm; 