import { Shield, Activity, AlertTriangle, Users, Settings, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Shield, label: "Dashboard", path: "/", active: location.pathname === "/" },
    { icon: Activity, label: "Agents", path: "/agents", active: location.pathname === "/agents" },
    { icon: AlertTriangle, label: "Alerts", path: "/alerts", active: location.pathname === "/alerts" },
    { icon: Database, label: "Cases", path: "/cases", active: location.pathname === "/cases" },
    { icon: Users, label: "Users", path: "/users", active: location.pathname === "/users" },
    { icon: Settings, label: "Settings", path: "/settings", active: location.pathname === "/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="border-b border-border bg-card shadow-elevated">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation("/")}>
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Vigilant Sentinel</h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => handleNavigation(item.path)}
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