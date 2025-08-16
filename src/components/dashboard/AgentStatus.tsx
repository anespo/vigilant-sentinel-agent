import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { Bot, Cpu, Database, Wifi, Zap, Shield } from "lucide-react";
import { SystemStatus } from "@/services/api";

interface AgentStatusProps {
  systemStatus: SystemStatus | null;
  isLoading: boolean;
}

export const AgentStatus = ({ systemStatus, isLoading }: AgentStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-alert-success text-white';
      case 'maintenance': return 'bg-alert-warning text-white';
      case 'error': return 'bg-alert-danger text-white';
      case 'inactive': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAgentIcon = (agentName: string) => {
    if (agentName.toLowerCase().includes('fraud')) return Bot;
    if (agentName.toLowerCase().includes('threat')) return Zap;
    if (agentName.toLowerCase().includes('case')) return Database;
    if (agentName.toLowerCase().includes('channel')) return Wifi;
    if (agentName.toLowerCase().includes('ml') || agentName.toLowerCase().includes('analytics')) return Cpu;
    return Shield;
  };

  const calculatePerformance = (processed: number, errors: number): number => {
    if (processed === 0) return 100;
    const errorRate = errors / processed;
    return Math.max(0, Math.min(100, (1 - errorRate) * 100));
  };

  const formatLastActivity = (lastActivity: string | null): string => {
    if (!lastActivity || lastActivity === "Never") return "No recent activity";
    
    try {
      const activityTime = new Date(lastActivity);
      const now = new Date();
      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return "Active now";
      if (diffMins < 60) return `Active ${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Active ${diffHours}h ago`;
      
      return "Inactive";
    } catch {
      return lastActivity;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Provide default agents if systemStatus is null or has no agents
  const agents = systemStatus?.agents || [
    {
      agent_name: "Fraud Detection Agent",
      status: "active",
      last_activity: "Never",
      processed_count: 0,
      error_count: 0
    },
    {
      agent_name: "Threat Response Agent",
      status: "active",
      last_activity: "Never",
      processed_count: 0,
      error_count: 0
    },
    {
      agent_name: "Case Manager Agent",
      status: "active",
      last_activity: "Never",
      processed_count: 0,
      error_count: 0
    }
  ];

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Agent Status
          <Badge variant="secondary" className="ml-auto">
            {agents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent, index) => {
          const IconComponent = getAgentIcon(agent.agent_name);
          const performance = calculatePerformance(agent.processed_count, agent.error_count);
          const isActive = agent.status.toLowerCase() === 'active';
          
          return (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">{agent.agent_name}</h4>
                </div>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
              
              {isActive && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Performance</span>
                      <span>{performance.toFixed(1)}%</span>
                    </div>
                    <Progress value={performance} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Processed Today</span>
                      <span>{agent.processed_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Errors</span>
                      <span className={agent.error_count > 0 ? 'text-alert-danger' : 'text-alert-success'}>
                        {agent.error_count}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              <p className="text-xs text-muted-foreground">
                {formatLastActivity(agent.last_activity)}
              </p>
            </div>
          );
        })}
        
        {/* System Overview */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">System Status</span>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                systemStatus?.system_status === 'operational' ? 'bg-alert-success' : 'bg-alert-danger'
              }`} />
              <span className="capitalize">{systemStatus?.system_status || 'unknown'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Active Alerts</span>
            <span className={(systemStatus?.active_alerts || 0) > 10 ? 'text-alert-warning' : 'text-muted-foreground'}>
              {systemStatus?.active_alerts || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};