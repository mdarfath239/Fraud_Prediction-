import React from "react";

interface TreeNode {
  feature?: string;
  threshold?: number;
  prediction?: string;
  confidence?: number;
  position: { x: number; y: number };
  connections?: { to: string; path: 'left' | 'right' }[];
}

interface TreeVisualizationProps {
  transactionData?: {
    time?: number;
    amount?: number;
    v12?: number;
    v14?: number;
    v17?: number;
  };
  highlightPath?: boolean;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ transactionData, highlightPath = false }) => {
  // Simplified representation of a decision tree for visualization
  const treeNodes: Record<string, TreeNode> = {
    'root': {
      feature: 'time',
      threshold: 10800, // 3 AM
      position: { x: 50, y: 10 },
      connections: [
        { to: 'night', path: 'left' },
        { to: 'day', path: 'right' }
      ]
    },
    'night': {
      feature: 'amount',
      threshold: 5,
      position: { x: 25, y: 30 },
      connections: [
        { to: 'smallNight', path: 'left' },
        { to: 'largeNight', path: 'right' }
      ]
    },
    'day': {
      feature: 'amount',
      threshold: 2,
      position: { x: 75, y: 30 },
      connections: [
        { to: 'smallDay', path: 'left' },
        { to: 'largeDay', path: 'right' }
      ]
    },
    'smallNight': {
      feature: 'V14',
      threshold: 0,
      position: { x: 15, y: 50 },
      connections: [
        { to: 'fraud1', path: 'left' },
        { to: 'checkV12', path: 'right' }
      ]
    },
    'largeNight': {
      feature: 'amount',
      threshold: 10000,
      position: { x: 35, y: 50 },
      connections: [
        { to: 'notFraud1', path: 'left' },
        { to: 'checkV17', path: 'right' }
      ]
    },
    'smallDay': {
      feature: 'V17',
      threshold: 0,
      position: { x: 65, y: 50 },
      connections: [
        { to: 'fraud2', path: 'left' },
        { to: 'notFraud2', path: 'right' }
      ]
    },
    'largeDay': {
      feature: 'amount',
      threshold: 15000,
      position: { x: 85, y: 50 },
      connections: [
        { to: 'notFraud3', path: 'left' },
        { to: 'checkV12High', path: 'right' }
      ]
    },
    'checkV12': {
      feature: 'V12',
      threshold: -2,
      position: { x: 20, y: 70 },
      connections: [
        { to: 'fraud3', path: 'left' },
        { to: 'notFraud4', path: 'right' }
      ]
    },
    'checkV17': {
      feature: 'V17',
      threshold: 1.5,
      position: { x: 40, y: 70 },
      connections: [
        { to: 'notFraud5', path: 'left' },
        { to: 'fraud4', path: 'right' }
      ]
    },
    'checkV12High': {
      feature: 'V12',
      threshold: 3,
      position: { x: 85, y: 70 },
      connections: [
        { to: 'notFraud6', path: 'left' },
        { to: 'fraud5', path: 'right' }
      ]
    },
    'fraud1': {
      prediction: 'Fraud',
      confidence: 92,
      position: { x: 10, y: 90 }
    },
    'fraud2': {
      prediction: 'Fraud',
      confidence: 78,
      position: { x: 60, y: 70 }
    },
    'fraud3': {
      prediction: 'Fraud',
      confidence: 85,
      position: { x: 15, y: 90 }
    },
    'fraud4': {
      prediction: 'Fraud',
      confidence: 88,
      position: { x: 45, y: 90 }
    },
    'fraud5': {
      prediction: 'Fraud',
      confidence: 82,
      position: { x: 90, y: 90 }
    },
    'notFraud1': {
      prediction: 'Not Fraud',
      confidence: 82,
      position: { x: 30, y: 70 }
    },
    'notFraud2': {
      prediction: 'Not Fraud',
      confidence: 65,
      position: { x: 70, y: 70 }
    },
    'notFraud3': {
      prediction: 'Not Fraud',
      confidence: 95,
      position: { x: 80, y: 70 }
    },
    'notFraud4': {
      prediction: 'Not Fraud',
      confidence: 75,
      position: { x: 25, y: 90 }
    },
    'notFraud5': {
      prediction: 'Not Fraud',
      confidence: 68,
      position: { x: 35, y: 90 }
    },
    'notFraud6': {
      prediction: 'Not Fraud',
      confidence: 72,
      position: { x: 85, y: 90 }
    }
  };

  // Determine the active path based on transaction data
  const getActivePath = (): string[] => {
    if (!transactionData || transactionData.time === undefined || transactionData.amount === undefined) {
      return [];
    }

    const path: string[] = ['root'];
    let currentNode = 'root';

    while (treeNodes[currentNode].connections) {
      const node = treeNodes[currentNode];
      if (!node.feature || node.threshold === undefined) break;

      let value: number | undefined;
      switch (node.feature) {
        case 'time': value = transactionData.time; break;
        case 'amount': value = transactionData.amount; break;
        case 'V12': value = transactionData.v12; break;
        case 'V14': value = transactionData.v14; break;
        case 'V17': value = transactionData.v17; break;
        default: value = undefined;
      }

      if (value === undefined) break;

      const nextConnection = node.connections!.find(conn => 
        conn.path === (value! < node.threshold! ? 'left' : 'right')
      );

      if (!nextConnection) break;
      
      currentNode = nextConnection.to;
      path.push(currentNode);
    }

    return path;
  };

  const activePath = highlightPath ? getActivePath() : [];

  return (
    <div className="relative w-full bg-white h-72 md:h-96 border rounded-md overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Draw connections */}
        {Object.entries(treeNodes).map(([nodeId, node]) => 
          node.connections?.map((conn, idx) => {
            const targetNode = treeNodes[conn.to];
            const isActive = highlightPath && 
                            activePath.includes(nodeId) && 
                            activePath.includes(conn.to);
            
            return (
              <line 
                key={`${nodeId}-${idx}`}
                x1={node.position.x} 
                y1={node.position.y + 2.5} 
                x2={targetNode.position.x} 
                y2={targetNode.position.y - 2.5}
                stroke={isActive ? "#ef4444" : "#d1d5db"}
                strokeWidth={isActive ? "0.6" : "0.4"}
                strokeDasharray={isActive ? "none" : "none"}
              />
            );
          })
        )}

        {/* Draw nodes */}
        {Object.entries(treeNodes).map(([nodeId, node]) => {
          const isActive = highlightPath && activePath.includes(nodeId);
          const isFraud = node.prediction === 'Fraud';
          const isLeaf = !node.connections;
          
          // Node colors based on type and activity
          let fillColor = "#f3f4f6"; // Default
          let textColor = "#000000";
          let strokeColor = "#d1d5db";
          
          if (isActive) {
            strokeColor = "#ef4444";
            // Set stroke width in the element attributes, not as variable
          }
          
          if (isLeaf) {
            fillColor = isFraud ? "#fee2e2" : "#ecfdf5";
            textColor = isFraud ? "#b91c1c" : "#047857";
          }
          
          return (
            <g key={nodeId}>
              {/* Node circle */}
              <circle 
                cx={node.position.x} 
                cy={node.position.y} 
                r={isLeaf ? 3 : 2.5}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isActive ? 0.5 : 0.3}
              />
              
              {/* Node label */}
              <text 
                x={node.position.x} 
                y={node.position.y + 0.3} 
                textAnchor="middle" 
                fontSize="2"
                fill={textColor}
                fontWeight={isActive ? "bold" : "normal"}
              >
                {node.prediction || node.feature}
              </text>
              
              {/* Show threshold for decision nodes */}
              {node.threshold !== undefined && !isLeaf && (
                <text 
                  x={node.position.x} 
                  y={node.position.y + 2.8} 
                  textAnchor="middle" 
                  fontSize="1.5"
                  fill={textColor}
                >
                  {`< ${node.threshold}`}
                </text>
              )}
              
              {/* Show confidence for leaf nodes */}
              {node.confidence && isLeaf && (
                <text 
                  x={node.position.x} 
                  y={node.position.y + 3.5} 
                  textAnchor="middle" 
                  fontSize="1.5"
                  fill={textColor}
                >
                  {`${node.confidence}%`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        Decision Tree Visualization
      </div>
    </div>
  );
};

export default TreeVisualization;
