import React from "react";
import { GitBranch, SplitSquareVertical, LineChart } from "lucide-react";

const DecisionTreeExplainer = () => {
  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
      <h2 className="text-xl font-semibold mb-4">How Decision Trees Work</h2>
      
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          A decision tree is a supervised machine learning algorithm that uses a tree-like model 
          to make predictions by following a path of decisions from root to leaf nodes.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <GitBranch className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Binary Splits</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Each node tests a specific feature (like time or amount) against a threshold value,
              branching left if the value is below the threshold, and right if it's above.
            </p>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <SplitSquareVertical className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Decision Path</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              The algorithm creates a path from root to leaf by making decisions at each node
              based on transaction attributes, resulting in a prediction with confidence level.
            </p>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <LineChart className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Feature Importance</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Features like transaction time, amount, and specific V-values (V12, V14, V17) 
              play critical roles in classifying transactions as fraudulent or legitimate.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h3 className="font-medium mb-2">Key Decision Points in Our Model</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary mt-0.5 mr-2">1</span>
              <div>
                <span className="font-medium">Time Check</span>: Transactions during early morning hours (before 3 AM) receive higher scrutiny
              </div>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary mt-0.5 mr-2">2</span>
              <div>
                <span className="font-medium">Amount Analysis</span>: Very small (under $2-5) or very large (over $10,000) amounts are examined more closely
              </div>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary mt-0.5 mr-2">3</span>
              <div>
                <span className="font-medium">Feature Evaluation</span>: V-values (V12, V14, V17) represent transaction patterns that may indicate fraud
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeExplainer;
