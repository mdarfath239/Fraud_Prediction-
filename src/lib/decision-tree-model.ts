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
  // Root node - Check time first
  feature: 'time',
  threshold: 10800, // 3 AM
  details: ["Evaluating transaction time"],
  left: {
    // Left branch - Suspicious time (night hours)
    feature: 'amount',
    threshold: 5,
    details: ["Transaction during suspicious hours (before 3 AM)", "Evaluating transaction amount"],
    left: {
      // Very small amount during suspicious hours
      feature: 'V14',
      threshold: 0,
      details: ["Small transaction amount during suspicious hours", "Checking transaction pattern (V14)"],
      left: {
        // V14 negative
        prediction: 'Fraud',
        confidence: 0.92,
        details: ["Small transaction during suspicious hours with negative V14 value"]
      },
      right: {
        // V14 positive
        feature: 'V12',
        threshold: -2,
        details: ["Small transaction during suspicious hours with positive V14 value", "Checking V12 value"],
        left: {
          prediction: 'Fraud',
          confidence: 0.85,
          details: ["Small transaction during suspicious hours with strongly negative V12 value"]
        },
        right: {
          prediction: 'Not Fraud',
          confidence: 0.75,
          details: ["Small transaction during suspicious hours but normal V12 value"]
        }
      }
    },
    right: {
      // Normal or large amount during suspicious hours
      feature: 'amount',
      threshold: 10000,
      details: ["Transaction during suspicious hours", "Evaluating if amount is very large"],
      left: {
        // Normal amount during suspicious hours
        prediction: 'Not Fraud',
        confidence: 0.82,
        details: ["Normal transaction amount during suspicious hours"]
      },
      right: {
        // Large amount during suspicious hours
        feature: 'V17',
        threshold: 1.5,
        details: ["Large transaction during suspicious hours", "Checking transaction pattern (V17)"],
        left: {
          prediction: 'Not Fraud',
          confidence: 0.68,
          details: ["Large transaction during suspicious hours but normal V17 value"]
        },
        right: {
          prediction: 'Fraud',
          confidence: 0.88,
          details: ["Large transaction during suspicious hours with abnormal V17 value"]
        }
      }
    }
  },
  right: {
    // Right branch - Normal time
    feature: 'amount',
    threshold: 2,
    details: ["Transaction during normal hours (after 3 AM)", "Evaluating if amount is very small"],
    left: {
      // Very small amount during normal hours
      feature: 'V17',
      threshold: 0,
      details: ["Very small transaction during normal hours", "Checking transaction pattern (V17)"],
      left: {
        prediction: 'Fraud',
        confidence: 0.78,
        details: ["Very small transaction with negative V17 value"]
      },
      right: {
        prediction: 'Not Fraud',
        confidence: 0.65,
        details: ["Very small transaction with positive V17 value"]
      }
    },
    right: {
      // Normal or large amount during normal hours
      feature: 'amount',
      threshold: 15000,
      details: ["Normal transaction time", "Evaluating if amount is extremely large"],
      left: {
        // Normal amount during normal hours
        prediction: 'Not Fraud',
        confidence: 0.95,
        details: ["Normal transaction amount during regular hours"]
      },
      right: {
        // Very large amount during normal hours
        feature: 'V12',
        threshold: 3,
        details: ["Very large transaction amount", "Checking transaction pattern (V12)"],
        left: {
          prediction: 'Not Fraud',
          confidence: 0.72,
          details: ["Large transaction with normal V12 value"]
        },
        right: {
          prediction: 'Fraud',
          confidence: 0.82,
          details: ["Large transaction with abnormal V12 value"]
        }
      }
    }
  }
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
    return {
      prediction: node.prediction,
      confidence: node.confidence || 0.5,
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
    confidence: parseFloat((result.confidence * 100).toFixed(2)),
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
