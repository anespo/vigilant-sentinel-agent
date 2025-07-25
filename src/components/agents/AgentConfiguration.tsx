import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Settings, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { useStrandsAgents } from '@/hooks/useStrandsAgents';
import { useToast } from '@/hooks/use-toast';

export const AgentConfiguration = () => {
  const { initializeServices, deployAgent, isLoading, error } = useStrandsAgents();
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    agentId: '',
    agentAliasId: '',
    sessionId: `session-${Date.now()}`,
    region: 'us-east-1'
  });

  const [deploymentConfig, setDeploymentConfig] = useState({
    agentName: 'fraud-detection-agent',
    description: 'AI agent for real-time fraud detection and prevention',
    roleArn: '',
    foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
    instruction: `You are an AI fraud detection agent. Analyze transactions for fraud indicators including:
- Unusual spending patterns
- Geographic anomalies  
- Device fingerprinting
- Velocity checks
- Risk scoring

Respond with JSON containing riskScore (0-100), riskLevel, recommendedAction, and reasons.`,
    agentResourceRoleArn: ''
  });

  const handleInitializeServices = () => {
    try {
      initializeServices(config);
      toast({
        title: "Services Initialized",
        description: "Strands Agent and Bedrock AgentCore services are ready.",
      });
    } catch (err) {
      toast({
        title: "Initialization Failed",
        description: `Failed to initialize services: ${err}`,
        variant: "destructive",
      });
    }
  };

  const handleDeployAgent = async () => {
    try {
      if (!deploymentConfig.roleArn) {
        toast({
          title: "Missing Configuration",
          description: "Please provide the IAM role ARN for the agent.",
          variant: "destructive",
        });
        return;
      }

      const deployment = await deployAgent(deploymentConfig);
      toast({
        title: "Agent Deployed",
        description: `Agent ${deployment.agentName} deployed successfully with ID: ${deployment.agentId}`,
      });
      
      // Update config with new agent ID
      setConfig(prev => ({ ...prev, agentId: deployment.agentId }));
    } catch (err) {
      toast({
        title: "Deployment Failed",
        description: `Failed to deploy agent: ${err}`,
        variant: "destructive",
      });
    }
  };

  const availableModels = [
    'anthropic.claude-3-sonnet-20240229-v1:0',
    'anthropic.claude-3-haiku-20240307-v1:0',
    'amazon.titan-text-express-v1',
    'meta.llama2-70b-chat-v1',
    'cohere.command-text-v14'
  ];

  const awsRegions = [
    'us-east-1',
    'us-west-2',
    'eu-west-1',
    'ap-southeast-1'
  ];

  return (
    <div className="space-y-6">
      {/* Service Configuration */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Strands Agent Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agentId">Agent ID</Label>
              <Input
                id="agentId"
                value={config.agentId}
                onChange={(e) => setConfig(prev => ({ ...prev, agentId: e.target.value }))}
                placeholder="Enter existing agent ID or deploy new agent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agentAliasId">Agent Alias ID</Label>
              <Input
                id="agentAliasId"
                value={config.agentAliasId}
                onChange={(e) => setConfig(prev => ({ ...prev, agentAliasId: e.target.value }))}
                placeholder="TSTALIASID or production alias"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionId">Session ID</Label>
              <Input
                id="sessionId"
                value={config.sessionId}
                onChange={(e) => setConfig(prev => ({ ...prev, sessionId: e.target.value }))}
                placeholder="Unique session identifier"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region</Label>
              <Select
                value={config.region}
                onValueChange={(value) => setConfig(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AWS region" />
                </SelectTrigger>
                <SelectContent>
                  {awsRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleInitializeServices} disabled={isLoading} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Initialize Services
          </Button>
        </CardContent>
      </Card>

      {/* Agent Deployment */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-security" />
            Deploy New Agent to Bedrock AgentCore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                value={deploymentConfig.agentName}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, agentName: e.target.value }))}
                placeholder="fraud-detection-agent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foundationModel">Foundation Model</Label>
              <Select
                value={deploymentConfig.foundationModel}
                onValueChange={(value) => setDeploymentConfig(prev => ({ ...prev, foundationModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select foundation model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="roleArn">IAM Role ARN</Label>
              <Input
                id="roleArn"
                value={deploymentConfig.roleArn}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, roleArn: e.target.value }))}
                placeholder="arn:aws:iam::123456789012:role/BedrockAgentRole"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={deploymentConfig.description}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="AI agent for real-time fraud detection"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instruction">Agent Instructions</Label>
            <Textarea
              id="instruction"
              value={deploymentConfig.instruction}
              onChange={(e) => setDeploymentConfig(prev => ({ ...prev, instruction: e.target.value }))}
              placeholder="Define the agent's behavior and response format..."
              rows={6}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDeployAgent} 
              disabled={isLoading || !deploymentConfig.roleArn}
              variant="security"
            >
              <Save className="w-4 h-4 mr-2" />
              Deploy Agent
            </Button>
            
            <Badge variant="outline" className="flex items-center gap-1">
              Runtime: Bedrock AgentCore
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle>AWS Setup Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <h4 className="font-semibold">Prerequisites:</h4>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>AWS CLI configured with appropriate credentials</li>
              <li>IAM role with Bedrock and AgentCore permissions</li>
              <li>Strands Agents deployed to AWS Lambda or container</li>
              <li>Foundation model access enabled in Bedrock</li>
            </ul>
            
            <h4 className="font-semibold mt-4">Required IAM Permissions:</h4>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>bedrock:InvokeModel</li>
              <li>bedrock-agent:*</li>
              <li>lambda:InvokeFunction</li>
              <li>logs:CreateLogGroup, logs:PutLogEvents</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};