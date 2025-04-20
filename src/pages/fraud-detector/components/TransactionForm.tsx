
import { RefreshCw, ArrowRight } from "lucide-react";
import { 
  formatTimeFromSeconds,
  timeSuggestions,
  amountSuggestions
} from "@/lib/models";
import { TransactionFormProps } from "../types";

const TransactionForm = ({
  time,
  setTime,
  amount,
  setAmount,
  vValues,
  isAnalyzing,
  showSuggestions,
  setShowSuggestions,
  generateVValues,
  analyzeTransaction
}: TransactionFormProps) => {
  
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

  return (
    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-6">Transaction Details</h2>
      
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
            placeholder=""
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
            placeholder=""
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Transaction Features (V1-V28)
            </label>
            <button
              type="button"
              onClick={generateVValues}
              className="text-xs text-primary flex items-center"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate Features
            </button>
          </div>
          <div className="border border-border rounded-md p-3 bg-secondary/20 text-xs text-muted-foreground font-mono h-20 overflow-y-auto">
            {vValues.length > 0 ? (
              vValues.map((v, i) => (
                <div key={i} className="inline-block mr-2 mb-1">
                  <span className="text-primary">V{i+1}:</span> {v.toFixed(3)}
                </div>
              ))
            ) : (
              "Click 'Generate Features' to simulate transaction parameters"
            )}
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
        
        <div>
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sm text-primary hover:underline"
          >
            {showSuggestions ? "Hide suggestions" : "Show test examples"}
          </button>
          
          {showSuggestions && (
            <div className="mt-4 space-y-4 bg-secondary/30 p-4 rounded-md text-sm">
              <div>
                <h4 className="font-medium mb-2">Time Examples:</h4>
                <div className="flex flex-wrap gap-2">
                  {timeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.value}
                      onClick={() => setTime(suggestion.value)}
                      className="px-2 py-1 rounded bg-secondary text-xs hover:bg-secondary/70 transition-colors"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Amount Examples:</h4>
                <div className="flex flex-wrap gap-2">
                  {amountSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.value}
                      onClick={() => setAmount(suggestion.value)}
                      className="px-2 py-1 rounded bg-secondary text-xs hover:bg-secondary/70 transition-colors"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
