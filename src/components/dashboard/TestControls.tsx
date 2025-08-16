import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2 } from "lucide-react";

interface TestControlsProps {
  onGenerateTransaction: () => Promise<void>;
  isLoading: boolean;
}

export const TestControls = ({ onGenerateTransaction, isLoading }: TestControlsProps) => {
  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Development Testing
              <Badge variant="secondary" className="text-xs">DEV</Badge>
            </CardTitle>
            <CardDescription>
              Generate test transactions to see the fraud detection system in action
            </CardDescription>
          </div>
          <Button 
            onClick={onGenerateTransaction}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Generate Test Transaction
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
