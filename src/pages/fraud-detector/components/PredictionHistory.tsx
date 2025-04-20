
import { Trash2 } from "lucide-react";
import { PredictionResult } from "../types";
import { formatTimeFromSeconds } from "@/lib/models";

interface PredictionHistoryProps {
  predictionHistory: PredictionResult[];
  deletePrediction: (id: string) => void;
}

const PredictionHistory = ({ predictionHistory, deletePrediction }: PredictionHistoryProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">History</h3>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {predictionHistory.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-3 rounded-md border shadow-sm transform hover:translate-y-[-2px] transition-transform ${
              item.prediction === "Fraud" 
                ? "border-red-200 bg-red-50/30" 
                : "border-green-200 bg-green-50/30"
            }`}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                item.prediction === "Fraud" ? "bg-red-500" : "bg-green-500"
              }`}></div>
              <div>
                <p className="text-sm font-medium">
                  {item.prediction} ({item.confidence}%)
                </p>
                <p className="text-xs text-muted-foreground">
                  ${item.features.amount.toFixed(2)} at {formatTimeFromSeconds(item.features.time)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.timestamp}
                </p>
              </div>
            </div>
            <button 
              onClick={() => deletePrediction(item.id)}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-background/80 rounded-full hover:bg-background"
              aria-label="Delete prediction"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;
