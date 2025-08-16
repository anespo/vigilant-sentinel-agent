import { useState, useEffect, useCallback } from 'react';
import { StrandsAgentService, FraudDetectionRequest, FraudDetectionResponse } from '@/services/strandsAgent';
import { BedrockAgentCoreService, AgentDeployment, AgentMetrics } from '@/services/awsBedrockAgentCore';

export interface AgentConfig {
  agentId: string;
  agentAliasId: string;
  sessionId: string;
  region: string;
}

export interface UseStrandsAgentsReturn {
  // Agent Services
  strandsAgent: StrandsAgentService | null;
  bedrockService: BedrockAgentCoreService | null;
  
  // Agent Status
  agents: AgentDeployment[];
  agentMetrics: Record<string, AgentMetrics[]>;
  isLoading: boolean;
  error: string | null;
  
  // Agent Operations
  detectFraud: (request: FraudDetectionRequest) => Promise<FraudDetectionResponse>;
  respondToThreat: (alertId: string, threatData: any) => Promise<any>;
  manageCase: (caseId: string, action: string, data: any) => Promise<any>;
  coordinateChannels: (channelData: any) => Promise<any>;
  
  // Infrastructure Operations
  deployAgent: (config: any) => Promise<AgentDeployment>;
  getAgentStatus: (agentId: string) => Promise<AgentDeployment>;
  scaleAgent: (agentId: string, config: any) => Promise<void>;
  
  // Utilities
  refreshAgents: () => Promise<void>;
  initializeServices: (config: AgentConfig) => void;
}

export function useStrandsAgents(): UseStrandsAgentsReturn {
  const [strandsAgent, setStrandsAgent] = useState<StrandsAgentService | null>(null);
  const [bedrockService, setBedrockService] = useState<BedrockAgentCoreService | null>(null);
  const [agents, setAgents] = useState<AgentDeployment[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<Record<string, AgentMetrics[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services with configuration
  const initializeServices = useCallback((config: AgentConfig) => {
    try {
      const strandsService = new StrandsAgentService(config);
      const bedrockSvc = new BedrockAgentCoreService({ region: config.region });
      
      setStrandsAgent(strandsService);
      setBedrockService(bedrockSvc);
      setError(null);
    } catch (err) {
      setError(`Failed to initialize services: ${err}`);
    }
  }, []);

  // Fraud Detection
  const detectFraud = useCallback(async (request: FraudDetectionRequest): Promise<FraudDetectionResponse> => {
    if (!strandsAgent) {
      throw new Error('Strands Agent service not initialized');
    }
    
    setIsLoading(true);
    try {
      const result = await strandsAgent.detectFraud(request);
      setError(null);
      return result;
    } catch (err) {
      const errorMsg = `Fraud detection failed: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [strandsAgent]);

  // Threat Response
  const respondToThreat = useCallback(async (alertId: string, threatData: any) => {
    if (!strandsAgent) {
      throw new Error('Strands Agent service not initialized');
    }
    
    setIsLoading(true);
    try {
      const result = await strandsAgent.respondToThreat({
        alertId,
        threatType: threatData.type,
        severity: threatData.severity,
        entityId: threatData.entityId,
        context: threatData
      });
      setError(null);
      return result;
    } catch (err) {
      const errorMsg = `Threat response failed: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [strandsAgent]);

  // Case Management
  const manageCase = useCallback(async (caseId: string, action: string, data: any) => {
    if (!strandsAgent) {
      throw new Error('Strands Agent service not initialized');
    }
    
    setIsLoading(true);
    try {
      const result = await strandsAgent.manageCase(caseId, action, data);
      setError(null);
      return result;
    } catch (err) {
      const errorMsg = `Case management failed: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [strandsAgent]);

  // Channel Coordination
  const coordinateChannels = useCallback(async (channelData: any) => {
    if (!strandsAgent) {
      throw new Error('Strands Agent service not initialized');
    }
    
    setIsLoading(true);
    try {
      const result = await strandsAgent.coordinateChannels(channelData);
      setError(null);
      return result;
    } catch (err) {
      const errorMsg = `Channel coordination failed: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [strandsAgent]);

  // Deploy Agent
  const deployAgent = useCallback(async (config: any): Promise<AgentDeployment> => {
    if (!bedrockService) {
      throw new Error('Bedrock AgentCore service not initialized');
    }
    
    setIsLoading(true);
    try {
      const deployment = await bedrockService.deployAgent(config);
      setError(null);
      await refreshAgents(); // Refresh the list after deployment
      return deployment;
    } catch (err) {
      const errorMsg = `Agent deployment failed: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [bedrockService]);

  // Get Agent Status
  const getAgentStatus = useCallback(async (agentId: string): Promise<AgentDeployment> => {
    if (!bedrockService) {
      throw new Error('Bedrock AgentCore service not initialized');
    }
    
    try {
      const status = await bedrockService.getAgentStatus(agentId);
      setError(null);
      return status;
    } catch (err) {
      const errorMsg = `Failed to get agent status: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [bedrockService]);

  // Scale Agent
  const scaleAgent = useCallback(async (agentId: string, config: any): Promise<void> => {
    if (!bedrockService) {
      throw new Error('Bedrock AgentCore service not initialized');
    }
    
    setIsLoading(true);
    try {
      await bedrockService.scaleAgent(agentId, config);
      setError(null);
    } catch (err) {
      const errorMsg = `Agent scaling failed: ${err}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [bedrockService]);

  // Refresh Agents List
  const refreshAgents = useCallback(async () => {
    if (!bedrockService) return;
    
    setIsLoading(true);
    try {
      const agentList = await bedrockService.listAgents();
      setAgents(agentList);
      
      // Load metrics for each agent
      const metricsPromises = agentList.map(async (agent) => {
        try {
          const metrics = await bedrockService.getAgentMetrics(agent.agentId);
          return { agentId: agent.agentId, metrics };
        } catch (err) {
          console.warn(`Failed to load metrics for agent ${agent.agentId}:`, err);
          return { agentId: agent.agentId, metrics: [] };
        }
      });
      
      const metricsResults = await Promise.all(metricsPromises);
      const metricsMap = metricsResults.reduce((acc, { agentId, metrics }) => {
        acc[agentId] = metrics;
        return acc;
      }, {} as Record<string, AgentMetrics[]>);
      
      setAgentMetrics(metricsMap);
      setError(null);
    } catch (err) {
      setError(`Failed to refresh agents: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [bedrockService]);

  // Load agents on service initialization
  useEffect(() => {
    if (bedrockService) {
      refreshAgents();
    }
  }, [bedrockService, refreshAgents]);

  return {
    strandsAgent,
    bedrockService,
    agents,
    agentMetrics,
    isLoading,
    error,
    detectFraud,
    respondToThreat,
    manageCase,
    coordinateChannels,
    deployAgent,
    getAgentStatus,
    scaleAgent,
    refreshAgents,
    initializeServices
  };
}