import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Bot, Cpu, Database, Wifi, Zap } from "lucide-react";

export const AgentStatus = () => {
  const agents = [
    {
      name: "Fraud Detection Agent",
      status: "active",
      performance: 98,
      lastActivity: "Processing transaction",
      load: 75,
      icon: Bot
    },
    {
      name: "Threat Response Agent",
      status: "active", 
      performance: 95,
      lastActivity: "Alert resolved",
      load: 42,
      icon: Zap
    },
    {
      name: "Case Manager Agent",
      status: "active",
      performance: 92,
      lastActivity: "Case escalated",
      load: 68,
      icon: Database
    },
    {
      name: "Channel Coordinator",
      status: "maintenance",
      performance: 0,
      lastActivity: "Scheduled maintenance",
      load: 0,
      icon: Wifi
    },
    {
      name: "ML Analytics Agent",
      status: "active",
      performance: 99,
      lastActivity: "Model training",
      load: 88,
      icon: Cpu
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-alert-success text-white';
      case 'maintenance': return 'bg-alert-warning text-white';
      case 'error': return 'bg-alert-danger text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLoadColor = (load: number) => {
    if (load > 80) return 'bg-alert-danger';
    if (load > 60) return 'bg-alert-warning';
    return 'bg-alert-success';
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <agent.icon className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">{agent.name}</h4>
              </div>
              <Badge className={getStatusColor(agent.status)}>
                {agent.status}
              </Badge>
            </div>
            
            {agent.status === 'active' && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Performance</span>
                    <span>{agent.performance}%</span>
                  </div>
                  <Progress value={agent.performance} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Load</span>
                    <span>{agent.load}%</span>
                  </div>
                  <Progress 
                    value={agent.load} 
                    className="h-2"
                  />
                </div>
              </>
            )}
            
            <p className="text-xs text-muted-foreground">
              {agent.lastActivity}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};