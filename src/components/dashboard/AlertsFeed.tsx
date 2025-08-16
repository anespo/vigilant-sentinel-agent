import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, CreditCard, MapPin, Clock, ArrowRight, Shield, CheckCircle, Loader2 } from "lucide-react";
import { FraudAlert } from "@/services/api";
import { useState } from "react";

interface AlertsFeedProps {
  alerts: FraudAlert[];
  onRespondToAlert: (alertId: string) => Promise<void>;
  isLoading: boolean;
}

export const AlertsFeed = ({ alerts, onRespondToAlert, isLoading }: AlertsFeedProps) => {
  const [respondingAlerts, setRespondingAlerts] = useState<Set<string>>(new Set());
  const [respondedAlerts, setRespondedAlerts] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-alert-danger text-white';
      case 'HIGH': return 'bg-alert-warning text-white';
      case 'MEDIUM': return 'bg-alert-info text-foreground';
      case 'LOW': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleRespond = async (alertId: string) => {
    try {
      console.log('Responding to alert:', alertId);
      
      // Add to responding set
      setRespondingAlerts(prev => new Set(prev).add(alertId));
      
      await onRespondToAlert(alertId);
      
      // Move to responded set
      setRespondedAlerts(prev => new Set(prev).add(alertId));
      console.log('Alert response completed successfully');
      
    } catch (error) {
      console.error('Failed to respond to alert:', error);
    } finally {
      // Remove from responding set
      setRespondingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const getResponseAction = (recommendedAction: string): string => {
    switch (recommendedAction) {
      case 'BLOCK_IMMEDIATELY': return 'Block Transaction';
      case 'FREEZE_AND_VERIFY': return 'Freeze & Verify';
      case 'ADDITIONAL_VERIFICATION': return 'Request Verification';
      case 'MANUAL_REVIEW': return 'Manual Review';
      case 'MONITOR': return 'Monitor';
      default: return 'Respond';
    }
  };

  const getActionColor = (recommendedAction: string): string => {
    switch (recommendedAction) {
      case 'BLOCK_IMMEDIATELY': return 'bg-red-500 hover:bg-red-600';
      case 'FREEZE_AND_VERIFY': return 'bg-orange-500 hover:bg-orange-600';
      case 'ADDITIONAL_VERIFICATION': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'MANUAL_REVIEW': return 'bg-blue-500 hover:bg-blue-600';
      case 'MONITOR': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-primary hover:bg-primary/90';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-alert-warning" />
            Live Fraud Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-18" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-alert-warning" />
          Live Fraud Alerts
          <Badge variant="secondary" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No active fraud alerts</p>
            <p className="text-xs">System is monitoring transactions</p>
          </div>
        ) : (
          alerts.slice(0, 10).map((alert) => {
            const isResponding = respondingAlerts.has(alert.transaction_id);
            const hasResponded = respondedAlerts.has(alert.transaction_id);
            
            return (
              <div key={alert.transaction_id} className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.transaction_id.slice(-8)}
                      </Badge>
                      {hasResponded && (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Responded
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm">
                      Risk Score: {(alert.risk_score * 100).toFixed(0)}%
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {alert.risk_factors.slice(0, 2).join(', ')}
                      {alert.risk_factors.length > 2 && ` +${alert.risk_factors.length - 2} more`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {alert.user_id && (
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      <span>User: {alert.user_id}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Action: {alert.recommended_action.replace(/_/g, ' ').toLowerCase()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 text-white ${getActionColor(alert.recommended_action)}`}
                    onClick={() => handleRespond(alert.transaction_id)}
                    disabled={isResponding || hasResponded}
                  >
                    {isResponding ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : hasResponded ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        {getResponseAction(alert.recommended_action)}
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2">
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Show what the response will do */}
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <strong>This will:</strong> {
                    alert.recommended_action === 'BLOCK_IMMEDIATELY' ? 'Immediately block the transaction and notify the customer' :
                    alert.recommended_action === 'FREEZE_AND_VERIFY' ? 'Freeze the account and request customer verification' :
                    alert.recommended_action === 'ADDITIONAL_VERIFICATION' ? 'Request additional verification from the customer' :
                    alert.recommended_action === 'MANUAL_REVIEW' ? 'Escalate to human analyst for manual review' :
                    'Monitor the transaction closely for additional suspicious activity'
                  }
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};