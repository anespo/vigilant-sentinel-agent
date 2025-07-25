// Strands Agent Integration Service
// This service interfaces with Strands Agents deployed on AWS Bedrock AgentCore

export interface StrandsAgentConfig {
  agentId: string;
  agentAliasId: string;
  sessionId: string;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
}

export interface FraudDetectionRequest {
  transactionId: string;
  amount: number;
  userId: string;
  merchantId: string;
  location: {
    country: string;
    city: string;
    ip: string;
  };
  deviceInfo: {
    deviceId: string;
    userAgent: string;
    fingerprint: string;
  };
  timestamp: string;
  paymentMethod: {
    type: string;
    last4: string;
    bin: string;
  };
}

export interface FraudDetectionResponse {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  action: 'approve' | 'decline' | 'review' | 'challenge';
  reasons: string[];
  confidence: number;
  mlModelVersion: string;
  agentId: string;
  processingTime: number;
}

export interface ThreatResponseRequest {
  alertId: string;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  entityId: string;
  context: Record<string, any>;
}

export interface ThreatResponseAction {
  actionType: 'block' | 'freeze' | 'notify' | 'escalate' | 'monitor';
  parameters: Record<string, any>;
  timestamp: string;
  agentId: string;
}

export class StrandsAgentService {
  private config: StrandsAgentConfig;
  private baseUrl: string;

  constructor(config: StrandsAgentConfig) {
    this.config = config;
    this.baseUrl = `https://bedrock-agent-runtime.${config.region}.amazonaws.com`;
  }

  /**
   * Fraud Detection Agent - Analyzes transactions for fraud indicators
   */
  async detectFraud(request: FraudDetectionRequest): Promise<FraudDetectionResponse> {
    const payload = {
      agentId: this.config.agentId,
      agentAliasId: this.config.agentAliasId,
      sessionId: this.config.sessionId,
      inputText: JSON.stringify({
        action: 'analyze_transaction',
        data: request
      })
    };

    try {
      const response = await this.invokeAgent(payload);
      return this.parseFraudResponse(response);
    } catch (error) {
      console.error('Fraud detection failed:', error);
      throw new Error(`Fraud detection service unavailable: ${error}`);
    }
  }

  /**
   * Threat Response Agent - Executes automated responses to threats
   */
  async respondToThreat(request: ThreatResponseRequest): Promise<ThreatResponseAction[]> {
    const payload = {
      agentId: this.config.agentId,
      agentAliasId: this.config.agentAliasId,
      sessionId: this.config.sessionId,
      inputText: JSON.stringify({
        action: 'respond_to_threat',
        data: request
      })
    };

    try {
      const response = await this.invokeAgent(payload);
      return this.parseThreatResponse(response);
    } catch (error) {
      console.error('Threat response failed:', error);
      throw new Error(`Threat response service unavailable: ${error}`);
    }
  }

  /**
   * Case Manager Agent - Manages fraud investigation cases
   */
  async manageCase(caseId: string, action: string, data: Record<string, any>) {
    const payload = {
      agentId: this.config.agentId,
      agentAliasId: this.config.agentAliasId,
      sessionId: this.config.sessionId,
      inputText: JSON.stringify({
        action: 'manage_case',
        caseId,
        operation: action,
        data
      })
    };

    try {
      const response = await this.invokeAgent(payload);
      return response;
    } catch (error) {
      console.error('Case management failed:', error);
      throw new Error(`Case management service unavailable: ${error}`);
    }
  }

  /**
   * Multi-Channel Coordinator - Coordinates agents across channels
   */
  async coordinateChannels(channelData: Record<string, any>) {
    const payload = {
      agentId: this.config.agentId,
      agentAliasId: this.config.agentAliasId,
      sessionId: this.config.sessionId,
      inputText: JSON.stringify({
        action: 'coordinate_channels',
        data: channelData
      })
    };

    try {
      const response = await this.invokeAgent(payload);
      return response;
    } catch (error) {
      console.error('Channel coordination failed:', error);
      throw new Error(`Channel coordination service unavailable: ${error}`);
    }
  }

  /**
   * Core method to invoke Strands Agent via AWS Bedrock AgentCore
   */
  private async invokeAgent(payload: any): Promise<any> {
    const url = `${this.baseUrl}/agents/${this.config.agentId}/agentAliases/${this.config.agentAliasId}/sessions/${this.config.sessionId}/text`;
    
    // Note: In production, use AWS SDK v3 with proper IAM credentials
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': await this.getAuthHeader(),
      'X-Amz-Target': 'AWSBedrockAgentRuntimeService.InvokeAgent'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Agent invocation failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private async getAuthHeader(): Promise<string> {
    // In production, implement AWS Signature V4 signing
    // For demo purposes, returning placeholder
    return 'AWS4-HMAC-SHA256 Credential=...';
  }

  private parseFraudResponse(response: any): FraudDetectionResponse {
    // Parse the Strands Agent response into our typed interface
    const agentOutput = JSON.parse(response.output?.text || '{}');
    
    return {
      riskScore: agentOutput.riskScore || 0,
      riskLevel: agentOutput.riskLevel || 'low',
      action: agentOutput.recommendedAction || 'review',
      reasons: agentOutput.riskFactors || [],
      confidence: agentOutput.confidence || 0,
      mlModelVersion: agentOutput.modelVersion || 'v1.0',
      agentId: this.config.agentId,
      processingTime: agentOutput.processingTimeMs || 0
    };
  }

  private parseThreatResponse(response: any): ThreatResponseAction[] {
    // Parse the Strands Agent response into threat response actions
    const agentOutput = JSON.parse(response.output?.text || '{}');
    
    return agentOutput.actions || [];
  }
}

// Factory function to create configured Strands Agent service
export function createStrandsAgentService(config: StrandsAgentConfig): StrandsAgentService {
  return new StrandsAgentService(config);
}