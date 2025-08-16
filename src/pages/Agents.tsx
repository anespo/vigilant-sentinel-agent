import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Zap, Database, Settings, Play, Pause, RotateCcw } from "lucide-react";
import { useFraudDetection } from "@/hooks/useFraudDetection";

const Agents = () => {
  const [state, actions] = useFraudDetection();

  const agents = state.systemStatus?.agents || [
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

  const getAgentIcon = (agentName: string) => {
    if (agentName.toLowerCase().includes('fraud')) return Bot;
    if (agentName.toLowerCase().includes('threat')) return Zap;
    if (agentName.toLowerCase().includes('case')) return Database;
    return Bot;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 text-white';
      case 'inactive': return 'bg-red-500 text-white';
      case 'maintenance': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Agents Management</h1>
            <p className="text-muted-foreground">Monitor and manage your fraud detection AI agents</p>
          </div>
          <Button onClick={actions.refreshSystemStatus}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => {
            const IconComponent = getAgentIcon(agent.agent_name);
            const performance = agent.processed_count > 0 
              ? ((agent.processed_count - agent.error_count) / agent.processed_count) * 100 
              : 100;

            return (
              <Card key={index} className="shadow-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{performance.toFixed(1)}%</span>
                    </div>
                    <Progress value={performance} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Processed</p>
                      <p className="font-semibold">{agent.processed_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className={`font-semibold ${agent.error_count > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {agent.error_count}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">Last Activity</p>
                    <p className="font-medium">
                      {agent.last_activity === "Never" ? "No recent activity" : 
                       new Date(agent.last_activity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      {agent.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Agent Logs Section */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Agent Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="text-sm p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> Fraud Detection Agent: Processing transaction analysis
              </div>
              <div className="text-sm p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">[{new Date(Date.now() - 60000).toLocaleTimeString()}]</span> Threat Response Agent: Alert response executed
              </div>
              <div className="text-sm p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">[{new Date(Date.now() - 120000).toLocaleTimeString()}]</span> Case Manager Agent: Case investigation completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Agents;
