import { StatsCards } from "./dashboard/StatsCards";
import { AlertsFeed } from "./dashboard/AlertsFeed";
import { AgentStatus } from "./dashboard/AgentStatus";
import { TransactionMonitor } from "./dashboard/TransactionMonitor";
import { ThreatMap } from "./dashboard/ThreatMap";

export const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      <StatsCards />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <TransactionMonitor />
          <ThreatMap />
        </div>
        
        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <AlertsFeed />
          <AgentStatus />
        </div>
      </div>
    </div>
  );
};