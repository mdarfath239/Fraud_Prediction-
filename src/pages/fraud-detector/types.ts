
export interface PredictionResult {
  prediction: 'Fraud' | 'Not Fraud';
  confidence: number;
  features: Record<string, number>;
  risk: 'Low' | 'High';
  details: string[];
  timestamp: string;
  id: string;
}

export interface FlowChartFactor {
  id: string;
  label: string;
  icon: React.ReactNode;
  detail: string;
  color: string;
}

export interface TransactionFormProps {
  time: number | "";
  setTime: (time: number | "") => void;
  amount: number | "";
  setAmount: (amount: number | "") => void;
  vValues: number[];
  isAnalyzing: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  generateVValues: () => void;
  analyzeTransaction: () => void;
  isDecisionTree?: boolean;
}

export interface ResultsPanelProps {
  result: PredictionResult | null;
  vValues: number[];
  time: number | "";
  amount: number | "";
  predictionHistory: PredictionResult[];
  downloadResults: () => void;
  resetForm: () => void;
  deletePrediction: (id: string) => void;
  isDecisionTree?: boolean;
  showDecisionPath?: boolean;
  toggleDecisionPath?: () => void;
}
