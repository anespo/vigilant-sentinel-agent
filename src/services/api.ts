/**
 * API Service for Vigilant Sentinel Anti-Fraud Application
 * Handles communication with the FastAPI backend
 */

export interface TransactionData {
  id: string;
  user_id: string;
  amount: number;
  merchant: string;
  location: string;
  timestamp: string;
  device_id: string;
  ip_address: string;
  card_type: string;
}

export interface FraudAlert {
  transaction_id: string;
  user_id?: string;
  risk_score: number;
  risk_factors: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommended_action: string;
  timestamp: string;
}

export interface AgentStatus {
  agent_name: string;
  status: string;
  last_activity: string;
  processed_count: number;
  error_count: number;
}

export interface SystemStatus {
  system_status: string;
  agents: AgentStatus[];
  active_alerts: number;
  timestamp: string;
}

export interface DashboardAnalytics {
  transaction_volume: {
    total_today: number;
    total_this_hour: number;
    average_per_minute: number;
  };
  fraud_detection: {
    alerts_today: number;
    blocked_transactions: number;
    false_positives: number;
    detection_rate: number;
  };
  risk_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  response_times: {
    average_detection_ms: number;
    average_response_ms: number;
    sla_compliance: number;
  };
  agent_performance: {
    [key: string]: {
      uptime: number;
      processed_today: number;
      error_rate: number;
    };
  };
  timestamp: string;
}

export interface CaseInvestigation {
  case_id: string;
  request_type: string;
  data: Record<string, any>;
}

class ApiService {
  private baseUrl: string;
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  // HTTP API Methods

  async getSystemStatus(): Promise<SystemStatus> {
    console.log('Fetching system status from:', `${this.baseUrl}/api/status`);
    const response = await fetch(`${this.baseUrl}/api/status`);
    if (!response.ok) {
      throw new Error(`Failed to get system status: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('System status response:', data);
    return data;
  }

  async analyzeTransaction(transaction: TransactionData): Promise<{ status: string; transaction_id: string; message: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/api/transactions/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(`Failed to analyze transaction: ${response.statusText}`);
    }
    return response.json();
  }

  async getActiveAlerts(): Promise<{ alerts: FraudAlert[]; count: number; timestamp: string }> {
    console.log('Fetching active alerts from:', `${this.baseUrl}/api/alerts`);
    const response = await fetch(`${this.baseUrl}/api/alerts`);
    if (!response.ok) {
      throw new Error(`Failed to get active alerts: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Active alerts response:', data);
    return data;
  }

  async respondToAlert(alertId: string): Promise<{ status: string; alert_id: string; message: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/api/alerts/${alertId}/respond`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to respond to alert: ${response.statusText}`);
    }
    return response.json();
  }

  async investigateCase(investigation: CaseInvestigation): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/cases/investigate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(investigation),
    });

    if (!response.ok) {
      throw new Error(`Failed to investigate case: ${response.statusText}`);
    }
    return response.json();
  }

  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const response = await fetch(`${this.baseUrl}/api/analytics/dashboard`);
    if (!response.ok) {
      throw new Error(`Failed to get dashboard analytics: ${response.statusText}`);
    }
    return response.json();
  }

  async generateTestTransaction(): Promise<{ status: string; transaction: TransactionData; timestamp: string }> {
    console.log('Generating test transaction...');
    const response = await fetch(`${this.baseUrl}/api/test/generate-transaction`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to generate test transaction: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Test transaction generated:', data);
    return data;
  }

  // WebSocket Methods

  connectWebSocket(): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws';
    console.log('Connecting to WebSocket:', wsUrl);
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('WebSocket connected');
      this.emit('websocket:connected');
      
      // Send subscription message
      this.websocket?.send(JSON.stringify({
        type: 'subscribe',
        channels: ['fraud_alerts', 'threat_responses', 'system_updates']
      }));
    };

    this.websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.websocket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('websocket:disconnected');
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        this.connectWebSocket();
      }, 5000);
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('websocket:error', error);
    };

    // Send periodic ping to keep connection alive
    setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds
  }

  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  private handleWebSocketMessage(message: any): void {
    console.log('WebSocket message received:', message);
    switch (message.type) {
      case 'fraud_alert':
        console.log('Processing fraud alert:', message.data);
        this.emit('fraud_alert', message.data);
        break;
      case 'threat_response':
        console.log('Processing threat response:', message.data);
        this.emit('threat_response', message.data);
        break;
      case 'system_update':
        console.log('Processing system update:', message.data);
        this.emit('system_update', message.data);
        break;
      case 'pong':
        // Handle ping response
        break;
      case 'subscription_confirmed':
        console.log('WebSocket subscription confirmed:', message.subscribed_to);
        break;
      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  }

  // Event Listener Methods

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility Methods

  isWebSocketConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }

  getWebSocketState(): string {
    if (!this.websocket) return 'DISCONNECTED';
    
    switch (this.websocket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  TransactionData,
  FraudAlert,
  AgentStatus,
  SystemStatus,
  DashboardAnalytics,
  CaseInvestigation,
};
