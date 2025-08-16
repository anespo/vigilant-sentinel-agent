import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Eye, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  // Mock user data
  const users = [
    {
      id: "user_1234",
      name: "John Smith",
      email: "john.smith@email.com",
      riskLevel: "LOW",
      riskScore: 0.15,
      accountStatus: "ACTIVE",
      lastActivity: "2024-01-25T14:30:00Z",
      transactionCount: 1247,
      flaggedTransactions: 0,
      location: "New York, NY",
      deviceCount: 2,
      accountAge: "3 years"
    },
    {
      id: "user_5678",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      riskLevel: "HIGH",
      riskScore: 0.78,
      accountStatus: "FROZEN",
      lastActivity: "2024-01-25T10:15:00Z",
      transactionCount: 89,
      flaggedTransactions: 5,
      location: "Los Angeles, CA",
      deviceCount: 4,
      accountAge: "6 months"
    },
    {
      id: "user_9012",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      riskLevel: "MEDIUM",
      riskScore: 0.45,
      accountStatus: "ACTIVE",
      lastActivity: "2024-01-25T12:45:00Z",
      transactionCount: 567,
      flaggedTransactions: 2,
      location: "Chicago, IL",
      deviceCount: 3,
      accountAge: "1.5 years"
    },
    {
      id: "user_3456",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      riskLevel: "CRITICAL",
      riskScore: 0.92,
      accountStatus: "SUSPENDED",
      lastActivity: "2024-01-24T18:20:00Z",
      transactionCount: 23,
      flaggedTransactions: 8,
      location: "Miami, FL",
      deviceCount: 6,
      accountAge: "2 months"
    }
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500 text-white';
      case 'FROZEN': return 'bg-blue-500 text-white';
      case 'SUSPENDED': return 'bg-red-500 text-white';
      case 'PENDING': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || user.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Monitor user accounts and risk profiles</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {users.filter(u => u.accountStatus === 'ACTIVE').length}
              </div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {users.filter(u => u.riskLevel === 'CRITICAL' || u.riskLevel === 'HIGH').length}
              </div>
              <p className="text-sm text-muted-foreground">High Risk Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                {users.filter(u => u.accountStatus === 'FROZEN').length}
              </div>
              <p className="text-sm text-muted-foreground">Frozen Accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-500">
                {users.reduce((sum, u) => sum + u.flaggedTransactions, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Flagged Transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No users match your current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(user.riskLevel)}>
                            {user.riskLevel} RISK
                          </Badge>
                          <Badge className={getStatusColor(user.accountStatus)}>
                            {user.accountStatus}
                          </Badge>
                          <span className="font-mono text-sm">{user.id}</span>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Risk Score:</span>
                            <p className="font-semibold">{(user.riskScore * 100).toFixed(0)}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Transactions:</span>
                            <p>{user.transactionCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Flagged:</span>
                            <p className={user.flaggedTransactions > 0 ? 'text-red-500 font-semibold' : ''}>
                              {user.flaggedTransactions}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Devices:</span>
                            <p>{user.deviceCount}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <p>{user.location}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Account Age:</span>
                            <p>{user.accountAge}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Activity:</span>
                            <p>{formatTimeAgo(user.lastActivity)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="w-3 h-3 mr-1" />
                          Actions
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UsersPage;
