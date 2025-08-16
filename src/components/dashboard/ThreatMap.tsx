import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { MapPin, Globe, AlertTriangle, Shield } from "lucide-react";
import { FraudAlert } from "@/services/api";

interface ThreatMapProps {
  alerts: FraudAlert[];
  isLoading: boolean;
}

export const ThreatMap = ({ alerts, isLoading }: ThreatMapProps) => {
  // Sample threat locations for demonstration
  const threatLocations = [
    {
      country: "United States",
      city: "New York",
      threats: 45,
      blocked: 42,
      severity: "medium",
      coordinates: { x: 25, y: 35 }
    },
    {
      country: "Nigeria", 
      city: "Lagos",
      threats: 78,
      blocked: 71,
      severity: "high",
      coordinates: { x: 52, y: 55 }
    },
    {
      country: "Russia",
      city: "Moscow",
      threats: 23,
      blocked: 20,
      severity: "low",
      coordinates: { x: 60, y: 25 }
    },
    {
      country: "China",
      city: "Beijing", 
      threats: 34,
      blocked: 30,
      severity: "medium",
      coordinates: { x: 75, y: 35 }
    },
    {
      country: "Brazil",
      city: "São Paulo",
      threats: 19,
      blocked: 17,
      severity: "low", 
      coordinates: { x: 30, y: 70 }
    },
    {
      country: "India",
      city: "Mumbai",
      threats: 67,
      blocked: 62,
      severity: "high",
      coordinates: { x: 70, y: 50 }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-alert-danger';
      case 'medium': return 'bg-alert-warning';
      case 'low': return 'bg-alert-success';
      default: return 'bg-muted';
    }
  };

  const getSeveritySize = (severity: string) => {
    switch (severity) {
      case 'high': return 'w-4 h-4';
      case 'medium': return 'w-3 h-3';
      case 'low': return 'w-2 h-2';
      default: return 'w-2 h-2';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Global Threat Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Global Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* World Map Visualization */}
        <div className="relative bg-gradient-to-br from-primary/5 to-security/10 rounded-lg p-6 h-64">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwIiBjeT0iMzAiIHJ4PSIxNSIgcnk9IjEwIiBmaWxsPSJoc2wodmFyKC0tYm9yZGVyKSkiIG9wYWNpdHk9IjAuMyIvPgo8ZWxsaXBzZSBjeD0iNzAiIGN5PSI0MCIgcng9IjIwIiByeT0iMTUiIGZpbGw9ImhzbCh2YXIoLS1ib3JkZXIpKSIgb3BhY2l0eT0iMC4zIi8+CjxlbGxpcHNlIGN4PSI0NSIgY3k9IjYwIiByeD0iMTAiIHJ5PSI4IiBmaWxsPSJoc2wodmFyKC0tYm9yZGVyKSkiIG9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4=')] opacity-20"></div>
          
          {/* Threat Markers */}
          {threatLocations.map((location, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ 
                left: `${location.coordinates.x}%`, 
                top: `${location.coordinates.y}%` 
              }}
            >
              <div className={`${getSeverityColor(location.severity)} ${getSeveritySize(location.severity)} rounded-full animate-pulse-alert shadow-alert`}></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border rounded-lg p-3 shadow-elevated w-48 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span className="font-semibold text-sm">{location.city}, {location.country}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Threats: {location.threats}</div>
                    <div>Blocked: {location.blocked}</div>
                  </div>
                  <Badge className={getSeverityColor(location.severity) + " text-white"}>
                    {location.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Threat Summary Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Active Threat Locations
          </h3>
          <div className="space-y-2">
            {threatLocations
              .sort((a, b) => b.threats - a.threats)
              .map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <div className={`${getSeverityColor(location.severity)} w-3 h-3 rounded-full`}></div>
                    <div>
                      <p className="font-medium text-sm">{location.city}, {location.country}</p>
                      <p className="text-xs text-muted-foreground">
                        {location.threats} threats detected
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs">
                      <Shield className="w-3 h-3 text-alert-success" />
                      <span>{Math.round((location.blocked / location.threats) * 100)}% blocked</span>
                    </div>
                    <Badge className={getSeverityColor(location.severity) + " text-white text-xs"}>
                      {location.severity}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};