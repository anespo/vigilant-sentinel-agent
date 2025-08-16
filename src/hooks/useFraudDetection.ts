/**
 * React Hook for Real-time Fraud Detection
 * Manages fraud alerts, system status, and real-time updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, FraudAlert, SystemStatus, DashboardAnalytics, TransactionData } from '../services/api';

export interface FraudDetectionState {
  // System Status
  systemStatus: SystemStatus | null;
  isSystemOnline: boolean;
  
  // Alerts
  activeAlerts: FraudAlert[];
  alertCount: number;
  
  // Analytics
  analytics: DashboardAnalytics | null;
  
  // Real-time Updates
  isWebSocketConnected: boolean;
  lastUpdate: string | null;
  
  // Loading States
  isLoading: boolean;
  error: string | null;
}

export interface FraudDetectionActions {
  // Data Fetching
  refreshSystemStatus: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  
  // Transaction Processing
  analyzeTransaction: (transaction: TransactionData) => Promise<void>;
  generateTestTransaction: () => Promise<void>;
  
  // Alert Management
  respondToAlert: (alertId: string) => Promise<void>;
  
  // WebSocket Management
  connectRealTime: () => void;
  disconnectRealTime: () => void;
  
  // Utility
  clearError: () => void;
}

export function useFraudDetection(): [FraudDetectionState, FraudDetectionActions] {
  // State
  const [state, setState] = useState<FraudDetectionState>({
    systemStatus: null,
    isSystemOnline: false,
    activeAlerts: [],
    alertCount: 0,
    analytics: null,
    isWebSocketConnected: false,
    lastUpdate: null,
    isLoading: false,
    error: null,
  });

  // Refs for cleanup
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // Helper function to safely update state
  const safeSetState = useCallback((updater: (prev: FraudDetectionState) => FraudDetectionState) => {
    if (isComponentMountedRef.current) {
      setState(updater);
    }
  }, []);

  // Error handler
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Fraud Detection Error (${context}):`, error);
    safeSetState(prev => ({
      ...prev,
      error: error.message || `Error in ${context}`,
      isLoading: false,
    }));
  }, [safeSetState]);

  // System Status
  const refreshSystemStatus = useCallback(async () => {
    try {
      console.log('Refreshing system status...');
      const status = await apiService.getSystemStatus();
      console.log('System status received:', status);
      safeSetState(prev => ({
        ...prev,
        systemStatus: status,
        isSystemOnline: status.system_status === 'operational',
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing system status:', error);
      handleError(error, 'refreshSystemStatus');
    }
  }, [safeSetState, handleError]);

  // Alerts
  const refreshAlerts = useCallback(async () => {
    try {
      console.log('Refreshing alerts...');
      const alertsData = await apiService.getActiveAlerts();
      console.log('Alerts received:', alertsData);
      safeSetState(prev => ({
        ...prev,
        activeAlerts: alertsData.alerts,
        alertCount: alertsData.count,
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      handleError(error, 'refreshAlerts');
    }
  }, [safeSetState, handleError]);

  // Analytics
  const refreshAnalytics = useCallback(async () => {
    try {
      const analytics = await apiService.getDashboardAnalytics();
      safeSetState(prev => ({
        ...prev,
        analytics,
        error: null,
      }));
    } catch (error) {
      handleError(error, 'refreshAnalytics');
    }
  }, [safeSetState, handleError]);

  // Transaction Analysis
  const analyzeTransaction = useCallback(async (transaction: TransactionData) => {
    safeSetState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiService.analyzeTransaction(transaction);
      safeSetState(prev => ({ ...prev, isLoading: false }));
      
      // Refresh alerts after a short delay to see the result
      setTimeout(() => {
        refreshAlerts();
      }, 1000);
    } catch (error) {
      handleError(error, 'analyzeTransaction');
    }
  }, [safeSetState, handleError, refreshAlerts]);

  // Generate Test Transaction
  const generateTestTransaction = useCallback(async () => {
    safeSetState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await apiService.generateTestTransaction();
      console.log('Generated test transaction:', result.transaction);
      safeSetState(prev => ({ ...prev, isLoading: false }));
      
      // Refresh alerts after a short delay
      setTimeout(() => {
        refreshAlerts();
      }, 2000);
    } catch (error) {
      handleError(error, 'generateTestTransaction');
    }
  }, [safeSetState, handleError, refreshAlerts]);

  // Alert Response
  const respondToAlert = useCallback(async (alertId: string) => {
    try {
      console.log('Responding to alert:', alertId);
      const response = await apiService.respondToAlert(alertId);
      console.log('Alert response result:', response);
      
      // Show success notification (you could use a toast library here)
      if (response.status === 'success') {
        console.log('✅ Threat response executed successfully:', response.actions_taken);
        
        // You could emit a custom event or use a toast notification here
        // For now, we'll just log the success
        safeSetState(prev => ({
          ...prev,
          lastUpdate: new Date().toISOString(),
        }));
      }
      
      // Refresh alerts to see the updated status
      setTimeout(() => {
        refreshAlerts();
      }, 1000);
    } catch (error) {
      console.error('❌ Failed to respond to alert:', error);
      handleError(error, 'respondToAlert');
    }
  }, [handleError, refreshAlerts, safeSetState]);

  // WebSocket Management
  const connectRealTime = useCallback(() => {
    apiService.connectWebSocket();
    
    // Set up event listeners
    const handleFraudAlert = (alert: FraudAlert) => {
      safeSetState(prev => ({
        ...prev,
        activeAlerts: [alert, ...prev.activeAlerts],
        alertCount: prev.alertCount + 1,
        lastUpdate: new Date().toISOString(),
      }));
    };

    const handleThreatResponse = (response: any) => {
      console.log('Threat response received:', response);
      safeSetState(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
      }));
    };

    const handleWebSocketConnected = () => {
      safeSetState(prev => ({
        ...prev,
        isWebSocketConnected: true,
        error: null,
      }));
    };

    const handleWebSocketDisconnected = () => {
      safeSetState(prev => ({
        ...prev,
        isWebSocketConnected: false,
      }));
    };

    const handleWebSocketError = (error: any) => {
      handleError(error, 'WebSocket');
    };

    // Register event listeners
    apiService.on('fraud_alert', handleFraudAlert);
    apiService.on('threat_response', handleThreatResponse);
    apiService.on('websocket:connected', handleWebSocketConnected);
    apiService.on('websocket:disconnected', handleWebSocketDisconnected);
    apiService.on('websocket:error', handleWebSocketError);

    // Cleanup function
    return () => {
      apiService.off('fraud_alert', handleFraudAlert);
      apiService.off('threat_response', handleThreatResponse);
      apiService.off('websocket:connected', handleWebSocketConnected);
      apiService.off('websocket:disconnected', handleWebSocketDisconnected);
      apiService.off('websocket:error', handleWebSocketError);
    };
  }, [safeSetState, handleError]);

  const disconnectRealTime = useCallback(() => {
    apiService.disconnectWebSocket();
    safeSetState(prev => ({
      ...prev,
      isWebSocketConnected: false,
    }));
  }, [safeSetState]);

  // Utility
  const clearError = useCallback(() => {
    safeSetState(prev => ({ ...prev, error: null }));
  }, [safeSetState]);

  // Initial data loading and periodic refresh
  useEffect(() => {
    const loadInitialData = async () => {
      safeSetState(prev => ({ ...prev, isLoading: true }));
      
      try {
        await Promise.all([
          refreshSystemStatus(),
          refreshAlerts(),
          refreshAnalytics(),
        ]);
      } catch (error) {
        handleError(error, 'loadInitialData');
      } finally {
        safeSetState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadInitialData();

    // Set up periodic refresh
    refreshIntervalRef.current = setInterval(() => {
      refreshSystemStatus();
      refreshAlerts();
      refreshAnalytics();
    }, 30000); // Refresh every 30 seconds

    // Connect to real-time updates
    const cleanupWebSocket = connectRealTime();

    // Cleanup
    return () => {
      isComponentMountedRef.current = false;
      
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      cleanupWebSocket();
      disconnectRealTime();
    };
  }, [
    refreshSystemStatus,
    refreshAlerts,
    refreshAnalytics,
    connectRealTime,
    disconnectRealTime,
    safeSetState,
    handleError,
  ]);

  // Update WebSocket connection status
  useEffect(() => {
    const checkWebSocketStatus = () => {
      const isConnected = apiService.isWebSocketConnected();
      safeSetState(prev => ({
        ...prev,
        isWebSocketConnected: isConnected,
      }));
    };

    const statusInterval = setInterval(checkWebSocketStatus, 5000);
    
    return () => clearInterval(statusInterval);
  }, [safeSetState]);

  // Actions object
  const actions: FraudDetectionActions = {
    refreshSystemStatus,
    refreshAlerts,
    refreshAnalytics,
    analyzeTransaction,
    generateTestTransaction,
    respondToAlert,
    connectRealTime,
    disconnectRealTime,
    clearError,
  };

  return [state, actions];
}

// Additional utility hooks

export function useAlertSeverityCount(alerts: FraudAlert[]) {
  return {
    critical: alerts.filter(a => a.severity === 'CRITICAL').length,
    high: alerts.filter(a => a.severity === 'HIGH').length,
    medium: alerts.filter(a => a.severity === 'MEDIUM').length,
    low: alerts.filter(a => a.severity === 'LOW').length,
  };
}

export function useRecentAlerts(alerts: FraudAlert[], minutes: number = 60) {
  const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
  
  return alerts.filter(alert => {
    const alertTime = new Date(alert.timestamp);
    return alertTime > cutoffTime;
  });
}
