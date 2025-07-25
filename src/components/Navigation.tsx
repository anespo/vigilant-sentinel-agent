import { Shield, Activity, AlertTriangle, Users, Settings, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export const Navigation = () => {
  const navItems = [
    { icon: Shield, label: "Dashboard", active: true },
    { icon: Activity, label: "Agents", active: false },
    { icon: AlertTriangle, label: "Alerts", active: false },
    { icon: Database, label: "Cases", active: false },
    { icon: Users, label: "Users", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <nav className="border-b border-border bg-card shadow-elevated">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">FraudGuard AI</h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "security" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Status Indicator */}
          <Card className="px-3 py-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-alert-success rounded-full animate-pulse-alert"></div>
            <span className="text-sm font-medium">All Systems Active</span>
          </Card>
        </div>
      </div>
    </nav>
  );
};