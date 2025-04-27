
/**
 * This file simulates a fraud detection model in the browser
 * In a real application, this would be handled by a server-side API
 */

// Constants for fraud detection
const SUSPICIOUS_TIMES = [0, 3600, 9000, 21600]; // Midnight, 1 AM, 2:30 AM, 6 AM
const SUSPICIOUS_AMOUNTS = [0, 0.99, 1.99, 10000, 15000, 900000];
const HIGH_RISK_V_VALUES = [14, 17, 12]; // V14, V17, V12 are highly correlated with fraud

interface TransactionData {
  time: number;
  amount: number;
  vValues: number[];
}

interface PredictionResult {
  prediction: 'Fraud' | 'Not Fraud';
  confidence: number;
  features: Record<string, number>;
  risk: 'Low' | 'High';
  details: string[];
}

/**
 * Represents a decision tree in the random forest
 */
interface DecisionTree {
  featureIndex: number;
  threshold: number;
  left?: DecisionTree;
  right?: DecisionTree;
  prediction?: 'Fraud' | 'Not Fraud';
}

/**
 * Creates a simple decision tree for fraud detection
 */
const createDecisionTree = (depth: number = 0, maxDepth: number = 3): DecisionTree => {
  if (depth >= maxDepth) {
    return {
      featureIndex: 0,
      threshold: 0,
      prediction: Math.random() > 0.5 ? 'Fraud' : 'Not Fraud'
    };
  }

  return {
    featureIndex: Math.floor(Math.random() * 3), // 0: time, 1: amount, 2: vValues
    threshold: Math.random() * 10 - 5,
    left: createDecisionTree(depth + 1, maxDepth),
    right: createDecisionTree(depth + 1, maxDepth)
  };
}

/**
 * Creates a random forest with multiple decision trees
 */
const createRandomForest = (numTrees: number = 10): DecisionTree[] => {
  return Array.from({ length: numTrees }, () => createDecisionTree());
}

// Initialize the random forest
const forest = createRandomForest();

/**
 * Predicts using a single decision tree
 */
const predictWithTree = (tree: DecisionTree, data: TransactionData): 'Fraud' | 'Not Fraud' => {
  if (tree.prediction) return tree.prediction;

  let featureValue: number;
  switch (tree.featureIndex) {
    case 0:
      featureValue = data.time;
      break;
    case 1:
      featureValue = data.amount;
      break;
    case 2:
      featureValue = data.vValues.reduce((sum, v) => sum + Math.abs(v), 0) / data.vValues.length;
      break;
    default:
      featureValue = 0;
  }

  return featureValue <= tree.threshold
    ? predictWithTree(tree.left!, data)
    : predictWithTree(tree.right!, data);
}

/**
 * Simulates fraud detection prediction using Random Forest
 */
export const predictFraud = (data: TransactionData): PredictionResult => {
  // Calculate risk factors
  const timeRisk = SUSPICIOUS_TIMES.some(time => Math.abs(data.time - time) < 3600) ? 1 : 0;
  const amountRisk = (data.amount < 2 || data.amount > 10000) ? 1 : 0;
  const vValueRisk = data.vValues.filter(v => Math.abs(v) > 5).length > 0 ? 1 : 0;
  
  // Calculate total risk score
  const riskScore = timeRisk + amountRisk + vValueRisk;
  
  // Determine if transaction is fraudulent based on risk factors
  const isFraud = riskScore >= 2; // Fraud if 2 or more risk factors are present
  
  // Generate risk details
  const details: string[] = [];
  
  if (timeRisk > 0) {
    details.push("Transaction time is during high-risk hours");
  }
  
  if (amountRisk > 0) {
    details.push(data.amount < 2 
      ? "Very small transaction amount is suspicious" 
      : "Very large transaction amount is suspicious");
  }

  const extremeValues = data.vValues.filter(v => Math.abs(v) > 5).length;
  if (extremeValues > 0) {
    details.push(`${extremeValues} features have extreme values`);
  }

  return {
    prediction: isFraud ? 'Fraud' : 'Not Fraud',
    confidence: isFraud ? 100 : 60,
    features: {
      time: data.time,
      amount: data.amount,
      V1: data.vValues[0] || 0,
      V12: data.vValues[11] || 0,
      V14: data.vValues[13] || 0,
      V17: data.vValues[16] || 0,
    },
    risk: isFraud ? 'High' : 'Low',
    details,
  };
};

/**
 * Generates random V values for testing
 */
export const generateRandomVValues = (): number[] => {
  return Array.from({ length: 28 }, () => {
    // Gaussian distribution around 0
    let value = 0;
    for (let i = 0; i < 6; i++) {
      value += Math.random() * 2 - 1;
    }
    return Number((value / 3).toFixed(8));
  });
};

/**
 * Converts time in seconds to readable format
 */
export const formatTimeFromSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  let period = hours < 12 ? 'AM' : 'PM';
  let hour = hours % 12;
  if (hour === 0) hour = 12;
  
  return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Examples of suspicious transaction times
 */
export const timeSuggestions = [
  { value: 0, label: '12:00 AM (Midnight)' },
  { value: 3600, label: '1:00 AM' },
  { value: 9000, label: '2:30 AM' },
  { value: 21600, label: '6:00 AM' },
  { value: 43200, label: '12:00 PM (Noon)' },
  { value: 64800, label: '6:00 PM' },
  { value: 86340, label: '11:59 PM' },
];

/**
 * Examples of suspicious transaction amounts
 */
export const amountSuggestions = [
  { value: 0.99, label: '$0.99 - Test Transaction' },
  { value: 1.99, label: '$1.99 - Small Test' },
  { value: 149.62, label: '$149.62 - Medium Purchase' },
  { value: 15000, label: '$15,000 - Very Large' },
  { value: 900000, label: '$900,000 - Extremely Large' },
];
