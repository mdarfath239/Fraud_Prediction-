
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
 * Simulates fraud detection prediction
 */
export const predictFraud = (data: TransactionData): PredictionResult => {
  // Calculate risk score based on time
  let timeRisk = 0;
  if (SUSPICIOUS_TIMES.some(time => Math.abs(data.time - time) < 3600)) {
    timeRisk = 0.3; // Higher risk during suspicious hours
  }
  
  // Calculate risk score based on amount
  let amountRisk = 0;
  if (data.amount < 2) {
    amountRisk = 0.25; // Very small amounts
  } else if (data.amount > 10000) {
    amountRisk = 0.35; // Very large amounts
  }
  
  // Calculate risk score based on V values
  let vValueRisk = 0;
  // Ensure vValues is not empty to avoid division by zero
  if (data.vValues && data.vValues.length > 0) {
    const extremeValues = data.vValues.filter(v => Math.abs(v) > 5).length;
    vValueRisk = extremeValues / data.vValues.length * 0.4;
  }
  
  // Check if high-risk V values are extreme
  const highRiskVExtreme = data.vValues && data.vValues.length > 0 && HIGH_RISK_V_VALUES.some(
    index => Math.abs(data.vValues[index] || 0) > 5
  );
  if (highRiskVExtreme) {
    vValueRisk += 0.2;
  }
  
  // Calculate total risk score
  const totalRisk = timeRisk + amountRisk + vValueRisk;
  
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
  
  // Check for extreme values in vValues
  let extremeValuesCount = 0;
  if (data.vValues && data.vValues.length > 0) {
    extremeValuesCount = data.vValues.filter(v => Math.abs(v) > 5).length;
    if (extremeValuesCount > 0) {
      details.push(`${extremeValuesCount} features have extreme values`);
    }
  }
  if (highRiskVExtreme) {
    details.push("Critical fraud indicators detected in transaction pattern");
  }
  
  // Determine risk level
  let risk: 'Low' | 'High';
  if (totalRisk < 0.5) {
    risk = 'Low';
  } else {
    risk = 'High';
  }
  
  // Make prediction
  const isFraud = totalRisk > 0.5;
  
  // Calculate confidence
  const confidence = isFraud
    ? 0.5 + totalRisk / 2 // 50-100% confidence for fraud
    : 1 - totalRisk; // Higher confidence for non-fraud when risk is low
  
  return {
    prediction: isFraud ? 'Fraud' : 'Not Fraud',
    confidence: parseFloat((confidence * 100).toFixed(2)),
    features: {
      time: data.time,
      amount: data.amount,
      // Include a few key V values
      V1: data.vValues[0] || 0,
      V12: data.vValues[11] || 0,
      V14: data.vValues[13] || 0,
      V17: data.vValues[16] || 0,
    },
    risk,
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
