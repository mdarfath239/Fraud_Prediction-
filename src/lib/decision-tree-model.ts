/**
 * This file implements a Decision Tree model for fraud detection
 * In a real application, this would be a trained model from historical data
 */

import { formatTimeFromSeconds } from "./models";

// Re-export these from the original models file to maintain compatibility
export { generateRandomVValues, formatTimeFromSeconds, timeSuggestions, amountSuggestions } from "./models";

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
 * Decision Tree Node for fraud detection
 */
interface DecisionTreeNode {
  feature?: string;
  threshold?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  prediction?: 'Fraud' | 'Not Fraud';
  confidence?: number;
  details?: string[];
}

/**
 * Simulated Decision Tree model for fraud detection
 * 
 * This is a simplified representation of what would be a trained model in production.
 * In a real application, this would be a model trained on historical transaction data.
 */
const decisionTreeModel: DecisionTreeNode = {
  feature: 'time',
  threshold: 10800, // 3 AM
  details: ["Evaluating transaction time"],
  left: {
    // Suspicious time (night hours)
    feature: 'amount',
    threshold: 5,
    details: ["Transaction during suspicious hours (before 3 AM)", "Evaluating transaction amount"],
    left: {
      // Small amount during suspicious hours - Higher fraud risk
      prediction: 'Fraud',
      confidence: 0.95,
      details: ["Small transaction amount during suspicious hours - High risk pattern"]
    },
    right: {
      feature: 'V17',
      threshold: 2,
      details: ["Large transaction during suspicious hours", "Checking V17 pattern"],
      left: {
        prediction: 'Not Fraud',
        confidence: 0.85,
        details: ["Normal V17 pattern despite suspicious hour"]
      },
      right: {
        prediction: 'Fraud',
        confidence: 0.92,
        details: ["Abnormal V17 pattern during suspicious hours"]
      }
    }
  },
  right: {
    // Normal hours
    feature: 'amount',
    threshold: 10000,
    details: ["Transaction during normal hours", "Checking amount"],
    left: {
      // Normal amount during normal hours
      prediction: 'Not Fraud',
      confidence: 0.90,
      details: ["Normal transaction pattern"]
    },
    right: {
      // Large amount - check V-values
      feature: 'V14',
      threshold: 1.5,
      details: ["Large transaction amount", "Analyzing V14 pattern"],
      left: {
        prediction: 'Fraud',
        confidence: 0.88,
        details: ["Suspicious V14 pattern with large amount"]
      },
      right: {
        prediction: 'Not Fraud',
        confidence: 0.82,
        details: ["Normal V14 pattern despite large amount"]
      }
    }
  }
};

/**
 * Calculates a dynamic confidence score based on transaction features
 * This simulates what predict_proba would do in a real ML model
 */
const calculateDynamicConfidence = (
  baseConfidence: number,
  prediction: 'Fraud' | 'Not Fraud',
  data: TransactionData
): number => {
  // Start with the base confidence from the decision tree
  let confidence = baseConfidence;
  
  // Adjust confidence based on how far the values are from decision boundaries
  if (prediction === 'Fraud') {
    // For fraud predictions, suspicious time periods increase confidence
    if (data.time < 10800) { // Before 3 AM
      const timeEffect = 0.05 * (1 - data.time / 10800);
      confidence += timeEffect;
    }
    
    // Very small or very large amounts increase fraud confidence
    if (data.amount < 5 || data.amount > 10000) {
      const amountEffect = data.amount < 5 ? 
        0.07 * (1 - data.amount / 5) : 
        0.05 * Math.min((data.amount - 10000) / 5000, 1);
      confidence += amountEffect;
    }
    
    // Extreme V values increase fraud confidence
    const v17 = data.vValues[16] || 0;
    const v14 = data.vValues[13] || 0;
    if (Math.abs(v17) > 2 || Math.abs(v14) > 1.5) {
      confidence += 0.03;
    }
  } else {
    // For non-fraud predictions, normal time periods increase confidence
    if (data.time >= 10800) {
      confidence += 0.02;
    }
    
    // Normal amounts increase non-fraud confidence
    if (data.amount >= 5 && data.amount <= 10000) {
      confidence += 0.03;
    }
    
    // Normal V values increase non-fraud confidence
    const v17 = data.vValues[16] || 0;
    const v14 = data.vValues[13] || 0;
    if (Math.abs(v17) <= 2 && Math.abs(v14) <= 1.5) {
      confidence += 0.04;
    }
  }
  
  // Ensure confidence stays within reasonable bounds (0.5 to 0.99)
  confidence = Math.max(0.5, Math.min(0.99, confidence));
  
  return confidence;
};

/**
 * Traverses the decision tree to make a prediction
 */
const traverseDecisionTree = (
  node: DecisionTreeNode, 
  data: TransactionData, 
  pathDetails: string[] = []
): { 
  prediction: 'Fraud' | 'Not Fraud', 
  confidence: number, 
  details: string[] 
} => {
  // If we've reached a leaf node, return the prediction
  if (node.prediction) {
    // Calculate dynamic confidence instead of using fixed value
    const dynamicConfidence = calculateDynamicConfidence(
      node.confidence || 0.5,
      node.prediction,
      data
    );
    
    return {
      prediction: node.prediction,
      confidence: dynamicConfidence,
      details: [...pathDetails, ...(node.details || [])]
    };
  }

  // Get the feature value based on the feature name
  let featureValue: number;
  if (node.feature === 'time') {
    featureValue = data.time;
  } else if (node.feature === 'amount') {
    featureValue = data.amount;
  } else if (node.feature?.startsWith('V') && node.feature.length > 1) {
    // Extract the index from feature name (e.g., 'V14' -> 14)
    const vIndex = parseInt(node.feature.substring(1)) - 1;
    featureValue = data.vValues[vIndex] || 0;
  } else {
    // Default case if feature is not recognized
    featureValue = 0;
  }

  // Add current node details to path
  const currentPathDetails = [...pathDetails];
  if (node.details) {
    currentPathDetails.push(...node.details);
  }

  // Add decision point information to the path details
  if (node.feature && node.threshold !== undefined) {
    let featureDisplay = node.feature;
    let valueDisplay = featureValue.toFixed(2);
    
    // Format time in a more readable way if the feature is time
    if (node.feature === 'time') {
      featureDisplay = 'Time';
      valueDisplay = `${featureValue} (${formatTimeFromSeconds(featureValue)})`;
    }
    
    currentPathDetails.push(
      `Decision point: ${featureDisplay} = ${valueDisplay} ${featureValue < node.threshold ? '<' : '≥'} ${node.threshold}`
    );
  }

  // Traverse left or right based on the feature value and threshold
  if (featureValue < (node.threshold || 0)) {
    return traverseDecisionTree(node.left!, data, currentPathDetails);
  } else {
    return traverseDecisionTree(node.right!, data, currentPathDetails);
  }
};

/**
 * Simulates fraud detection prediction using a Decision Tree
 */
export const predictFraudWithDecisionTree = (data: TransactionData): PredictionResult => {
  // Traverse the decision tree to get prediction
  const result = traverseDecisionTree(decisionTreeModel, data);
  
  // Determine risk level based on confidence
  const risk: 'Low' | 'High' = result.confidence > 0.75 ? 
    (result.prediction === 'Fraud' ? 'High' : 'Low') : 
    (result.prediction === 'Fraud' ? 'High' : 'Low');
  
  return {
    prediction: result.prediction,
    confidence: parseFloat((result.confidence * 100).toFixed(0)), // Round to whole number
    features: {
      time: data.time,
      amount: data.amount,
      // Include key V values used in the decision tree
      V12: data.vValues[11] || 0,
      V14: data.vValues[13] || 0,
      V17: data.vValues[16] || 0,
    },
    risk,
    details: result.details,
  };
};
