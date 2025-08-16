import { useEffect } from "react";
import { StatsCards } from "./dashboard/StatsCards";
import { AlertsFeed } from "./dashboard/AlertsFeed";
import { AgentStatus } from "./dashboard/AgentStatus";
import { TransactionMonitor } from "./dashboard/TransactionMonitor";
import { ThreatMap } from "./dashboard/ThreatMap";
import { TestControls } from "./dashboard/TestControls";
import { useFraudDetection } from "@/hooks/useFraudDetection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Wifi, WifiOff, Bot, Activity } from "lucide-react";

export const Dashboard = () => {
  const [state, actions] = useFraudDetection();

  // Show connection status
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {state.isWebSocketConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Real-time Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-red-600">Real-time Disconnected</span>
        </>
      )}
      {state.lastUpdate && (
        <span className="text-muted-foreground ml-2">
          Last update: {new Date(state.lastUpdate).toLocaleTimeString()}
        </span>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Connection Status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Vigilant Sentinel
          </h1>
          <p className="text-muted-foreground">AI-Powered Fraud Detection & Response</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ConnectionStatus />
          {state.systemStatus && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${
                state.isSystemOnline ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={state.isSystemOnline ? 'text-green-600' : 'text-red-600'}>
                System {state.systemStatus.system_status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {state.error}
            <button 
              onClick={actions.clearError}
              className="text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Test Controls (Development) */}
      <TestControls 
        onGenerateTransaction={actions.generateTestTransaction}
        isLoading={state.isLoading}
      />
      
      {/* Debug Controls */}
      <Card className="border-dashed border-2 border-yellow-200 bg-yellow-50/50">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-4">Debug Controls:</span>
            <Button 
              onClick={actions.refreshSystemStatus}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Bot className="h-3 w-3" />
              Refresh Status
            </Button>
            <Button 
              onClick={actions.refreshAlerts}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              Refresh Alerts
            </Button>
            <Button 
              onClick={actions.refreshAnalytics}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              Refresh Analytics
            </Button>
            <div className="flex items-center gap-4 ml-auto text-sm text-muted-foreground">
              <span>Alerts: <strong>{state.alertCount}</strong></span>
              <span>WebSocket: {state.isWebSocketConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
              <span>Loading: {state.isLoading ? '⏳' : '✅'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Overview */}
      <StatsCards 
        analytics={state.analytics}
        alertCount={state.alertCount}
        isLoading={state.isLoading}
      />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <TransactionMonitor 
            analytics={state.analytics}
            isLoading={state.isLoading}
          />
          <ThreatMap 
            alerts={state.activeAlerts}
            isLoading={state.isLoading}
          />
        </div>
        
        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <AlertsFeed 
            alerts={state.activeAlerts}
            onRespondToAlert={actions.respondToAlert}
            isLoading={state.isLoading}
          />
          <AgentStatus 
            systemStatus={state.systemStatus}
            isLoading={state.isLoading}
          />
        </div>
      </div>
    </div>
  );
};