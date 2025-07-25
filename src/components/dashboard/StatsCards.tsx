import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Shield, Activity, AlertTriangle, TrendingUp, Clock, CheckCircle } from "lucide-react";

export const StatsCards = () => {
  const stats = [
    {
      title: "Transactions Monitored",
      value: "2,847,392",
      change: "+12.3%",
      icon: Activity,
      trend: "up",
      color: "text-security"
    },
    {
      title: "Threats Blocked",
      value: "1,247",
      change: "+5.7%",
      icon: Shield,
      trend: "up",
      color: "text-alert-success"
    },
    {
      title: "Active Alerts",
      value: "23",
      change: "-18.2%",
      icon: AlertTriangle,
      trend: "down",
      color: "text-alert-warning"
    },
    {
      title: "Response Time",
      value: "0.3s",
      change: "-12.5%",
      icon: Clock,
      trend: "down",
      color: "text-primary"
    },
    {
      title: "AI Accuracy",
      value: "99.2%",
      change: "+0.5%",
      icon: TrendingUp,
      trend: "up",
      color: "text-alert-success"
    },
    {
      title: "Cases Resolved",
      value: "18,473",
      change: "+22.1%",
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
              stat.trend === 'up' ? 'text-alert-success' : 'text-alert-danger'
            }`}>
              {stat.change} from last hour
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};