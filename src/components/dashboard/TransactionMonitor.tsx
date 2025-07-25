import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, DollarSign, AlertCircle, Shield } from "lucide-react";

export const TransactionMonitor = () => {
  const transactionData = [
    { time: '00:00', transactions: 1250, fraudulent: 15, blocked: 12 },
    { time: '04:00', transactions: 890, fraudulent: 8, blocked: 7 },
    { time: '08:00', transactions: 3200, fraudulent: 45, blocked: 42 },
    { time: '12:00', transactions: 4100, fraudulent: 38, blocked: 35 },
    { time: '16:00', transactions: 3800, fraudulent: 52, blocked: 48 },
    { time: '20:00', transactions: 2900, fraudulent: 28, blocked: 25 },
  ];

  const riskDistribution = [
    { risk: 'Low', count: 45230, color: '#10b981' },
    { risk: 'Medium', count: 2150, color: '#f59e0b' },
    { risk: 'High', count: 287, color: '#ef4444' },
    { risk: 'Critical', count: 23, color: '#dc2626' }
  ];

  const recentTransactions = [
    {
      id: "TXN-789123",
      amount: "$2,450.00",
      user: "Alice Johnson", 
      risk: "low",
      status: "approved",
      time: "Just now"
    },
    {
      id: "TXN-789124",
      amount: "$15,000.00",
      user: "Bob Smith",
      risk: "high", 
      status: "flagged",
      time: "2 min ago"
    },
    {
      id: "TXN-789125",
      amount: "$89.99",
      user: "Carol Davis",
      risk: "low",
      status: "approved", 
      time: "3 min ago"
    },
    {
      id: "TXN-789126",
      amount: "$7,250.00",
      user: "David Wilson",
      risk: "medium",
      status: "reviewing",
      time: "5 min ago"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-alert-success text-white';
      case 'medium': return 'bg-alert-warning text-white';
      case 'high': return 'bg-alert-danger text-white';
      case 'critical': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-alert-success text-white';
      case 'flagged': return 'bg-alert-danger text-white';
      case 'reviewing': return 'bg-alert-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Real-Time Transaction Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Volume Chart */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Transaction Volume & Fraud Detection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="transactions" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Transactions" />
                <Line type="monotone" dataKey="fraudulent" stroke="hsl(var(--alert-danger))" strokeWidth={2} name="Fraudulent" />
                <Line type="monotone" dataKey="blocked" stroke="hsl(var(--alert-success))" strokeWidth={2} name="Blocked" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Risk Distribution (Last Hour)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Recent Transactions</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{transaction.id}</p>
                      <p className="font-semibold">{transaction.amount}</p>
                      <p className="text-sm">{transaction.user}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getRiskColor(transaction.risk)}>
                        {transaction.risk}
                      </Badge>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="security" size="sm">
            <Shield className="w-4 h-4 mr-1" />
            Block Suspicious IPs
          </Button>
          <Button variant="outline" size="sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <DollarSign className="w-4 h-4 mr-1" />
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};