import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Shield, Activity, AlertTriangle, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { DashboardAnalytics } from "@/services/api";

interface StatsCardsProps {
  analytics: DashboardAnalytics | null;
  alertCount: number;
  isLoading: boolean;
}

export const StatsCards = ({ analytics, alertCount, isLoading }: StatsCardsProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return (num * 100).toFixed(1) + '%';
  };

  // Provide default values if analytics is null
  const safeAnalytics = analytics || {
    transaction_volume: { total_today: 0, average_per_minute: 0 },
    fraud_detection: { blocked_transactions: 0, detection_rate: 0, alerts_today: 0, false_positives: 0 },
    response_times: { average_response_ms: 0, sla_compliance: 0 },
    agent_performance: { fraud_detection_agent: { uptime: 0, processed_today: 0 } }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="shadow-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Transactions Today",
      value: formatNumber(safeAnalytics.transaction_volume.total_today),
      change: `${safeAnalytics.transaction_volume.average_per_minute}/min`,
      icon: Activity,
      trend: "up",
      color: "text-security"
    },
    {
      title: "Threats Blocked",
      value: safeAnalytics.fraud_detection.blocked_transactions.toString(),
      change: `${formatPercentage(safeAnalytics.fraud_detection.detection_rate)} detection rate`,
      icon: Shield,
      trend: "up",
      color: "text-alert-success"
    },
    {
      title: "Active Alerts",
      value: alertCount.toString(),
      change: `${safeAnalytics.fraud_detection.alerts_today} today`,
      icon: AlertTriangle,
      trend: alertCount > 10 ? "up" : "down",
      color: "text-alert-warning"
    },
    {
      title: "Response Time",
      value: `${safeAnalytics.response_times.average_response_ms}ms`,
      change: `${formatPercentage(safeAnalytics.response_times.sla_compliance)} SLA`,
      icon: Clock,
      trend: "down",
      color: "text-primary"
    },
    {
      title: "AI Accuracy",
      value: formatPercentage(1 - (safeAnalytics.fraud_detection.false_positives / Math.max(safeAnalytics.fraud_detection.alerts_today, 1))),
      change: `${safeAnalytics.fraud_detection.false_positives} false positives`,
      icon: TrendingUp,
      trend: "up",
      color: "text-alert-success"
    },
    {
      title: "System Uptime",
      value: formatPercentage(safeAnalytics.agent_performance.fraud_detection_agent?.uptime || 0),
      change: `${formatNumber(safeAnalytics.agent_performance.fraud_detection_agent?.processed_today || 0)} processed`,
      icon: CheckCircle,
      trend: "up",
      color: "text-security"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-elevated hover:shadow-security transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${
              stat.trend === 'up' ? 'text-alert-success' : 'text-muted-foreground'
            }`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};