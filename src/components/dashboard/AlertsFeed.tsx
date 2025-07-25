import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertTriangle, CreditCard, MapPin, Clock, ArrowRight } from "lucide-react";

export const AlertsFeed = () => {
  const alerts = [
    {
      id: "ALT-001",
      type: "Suspicious Transaction",
      description: "Multiple high-value transactions from new location",
      severity: "high",
      time: "2 min ago",
      user: "John Doe",
      amount: "$15,000",
      location: "Mumbai, India",
      status: "pending"
    },
    {
      id: "ALT-002", 
      type: "Account Takeover",
      description: "Login from unrecognized device",
      severity: "critical",
      time: "5 min ago",
      user: "Sarah Wilson",
      amount: "$2,500",
      location: "Lagos, Nigeria",
      status: "investigating"
    },
    {
      id: "ALT-003",
      type: "Card Skimming",
      description: "Potential card skimming detected",
      severity: "medium",
      time: "12 min ago",
      user: "Mike Johnson", 
      amount: "$780",
      location: "New York, USA",
      status: "resolved"
    },
    {
      id: "ALT-004",
      type: "Identity Verification",
      description: "Failed biometric verification",
      severity: "low",
      time: "18 min ago",
      user: "Emily Chen",
      amount: "$150",
      location: "Singapore",
      status: "pending"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-alert-danger text-white';
      case 'high': return 'bg-alert-warning text-white';
      case 'medium': return 'bg-alert-info text-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-alert-success text-white';
      case 'investigating': return 'bg-alert-warning text-white';
      case 'pending': return 'bg-alert-danger text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-alert-warning" />
          Live Fraud Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-smooth">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{alert.id}</Badge>
                </div>
                <h4 className="font-semibold text-sm">{alert.type}</h4>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
              </div>
              <Badge className={getStatusColor(alert.status)}>
                {alert.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>{alert.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{alert.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{alert.amount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{alert.time}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              Investigate <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};