
import { Shield } from "lucide-react";

const NoResults = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
      <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 shadow-md">
        <Shield className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
      <p className="text-muted-foreground max-w-md">
        Enter transaction details and click "Analyze Transaction" to test our fraud detection system.
      </p>
    </div>
  );
};

export default NoResults;
