import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, DollarSign, AlertCircle, Shield } from "lucide-react";
import { DashboardAnalytics } from "@/services/api";

interface TransactionMonitorProps {
  analytics: DashboardAnalytics | null;
  isLoading: boolean;
}

export const TransactionMonitor = ({ analytics, isLoading }: TransactionMonitorProps) => {
  // Sample data for demonstration - in production this would come from analytics
  const transactionData = [
    { time: '00:00', transactions: 1250, fraudulent: 15, blocked: 12 },
    { time: '04:00', transactions: 890, fraudulent: 8, blocked: 7 },
    { time: '08:00', transactions: 3200, fraudulent: 45, blocked: 42 },
    { time: '12:00', transactions: 4100, fraudulent: 38, blocked: 35 },
    { time: '16:00', transactions: 3800, fraudulent: 52, blocked: 48 },
    { time: '20:00', transactions: 2900, fraudulent: 28, blocked: 25 },
  ];

  const getRiskDistribution = () => {
    if (!analytics) {
      return [
        { risk: 'Low', count: 45230, color: '#10b981' },
        { risk: 'Medium', count: 2150, color: '#f59e0b' },
        { risk: 'High', count: 287, color: '#ef4444' },
        { risk: 'Critical', count: 23, color: '#dc2626' },
      ];
    }

    return [
      { risk: 'Low', count: analytics.risk_distribution.low, color: '#10b981' },
      { risk: 'Medium', count: analytics.risk_distribution.medium, color: '#f59e0b' },
      { risk: 'High', count: analytics.risk_distribution.high, color: '#ef4444' },
      { risk: 'Critical', count: analytics.risk_distribution.critical, color: '#dc2626' },
    ];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-elevated">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-elevated">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskDistribution = getRiskDistribution();

  const recentTransactions = [
    {
      id: "TXN-789123",
      amount: "$2,450.00",
      user: "Alice Johnson", 
      risk: "low",
      time: "2 min ago",
      status: "approved"
    },
    {
      id: "TXN-456789",
      amount: "$15,000.00",
      user: "Bob Smith",
      risk: "high", 
      time: "5 min ago",
      status: "blocked"
    },
    {
      id: "TXN-123456",
      amount: "$89.99",
      user: "Carol Davis",
      risk: "low",
      time: "8 min ago", 
      status: "approved"
    },
    {
      id: "TXN-987654",
      amount: "$3,200.00",
      user: "David Wilson",
      risk: "medium",
      time: "12 min ago",
      status: "reviewing"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-alert-danger';
      case 'medium': return 'text-alert-warning';
      case 'low': return 'text-alert-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-alert-success text-white';
      case 'blocked': return 'bg-alert-danger text-white';
      case 'reviewing': return 'bg-alert-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Transaction Volume Chart */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Transaction Volume & Fraud Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Transactions"
              />
              <Line 
                type="monotone" 
                dataKey="fraudulent" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Fraudulent"
              />
              <Line 
                type="monotone" 
                dataKey="blocked" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Blocked"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="risk" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Recent Transactions */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Recent Transactions
            </h4>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">{transaction.id}</p>
                      <p className="text-xs text-muted-foreground">{transaction.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{transaction.amount}</span>
                    <span className={`text-xs font-medium ${getRiskColor(transaction.risk)}`}>
                      {transaction.risk.toUpperCase()}
                    </span>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
