
import { ResultsPanelProps } from "../types";
import AnalysisResult from "./AnalysisResult";
import DecisionTreeResult from "./DecisionTreeResult";
import PredictionHistory from "./PredictionHistory";
import NoResults from "./NoResults";
import { Eye, EyeOff } from "lucide-react";

const ResultsPanel = ({
  result,
  vValues,
  time,
  amount,
  predictionHistory,
  downloadResults,
  resetForm,
  deletePrediction,
  isDecisionTree = false,
  showDecisionPath = true,
  toggleDecisionPath
}: ResultsPanelProps) => {
  return (
    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
      
      {result ? (
        <div className="space-y-6">
          {isDecisionTree ? (
            <DecisionTreeResult 
              result={result}
              downloadResults={downloadResults}
              resetForm={resetForm}
            />
          ) : (
            <AnalysisResult 
              result={result}
              downloadResults={downloadResults}
              resetForm={resetForm}
            />
          )}
        </div>
      ) : (
        <NoResults />
      )}

      {predictionHistory.length > 0 && (
        <PredictionHistory 
          predictionHistory={predictionHistory}
          deletePrediction={deletePrediction}
        />
      )}
    </div>
  );
};

export default ResultsPanel;
