import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Search, Plus, Eye, FileText, Clock } from "lucide-react";
import { useState } from "react";

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock case data
  const cases = [
    {
      id: "CASE-2024-001",
      title: "Suspicious High-Value Transaction",
      status: "INVESTIGATING",
      priority: "HIGH",
      assignedTo: "John Analyst",
      createdAt: "2024-01-25T10:30:00Z",
      updatedAt: "2024-01-25T14:20:00Z",
      transactionId: "txn_123456",
      amount: "$15,000",
      riskScore: 0.85,
      description: "Multiple high-value transactions from new location with unrecognized device"
    },
    {
      id: "CASE-2024-002", 
      title: "Account Takeover Attempt",
      status: "RESOLVED",
      priority: "CRITICAL",
      assignedTo: "Sarah Investigator",
      createdAt: "2024-01-24T16:45:00Z",
      updatedAt: "2024-01-25T09:15:00Z",
      transactionId: "txn_789012",
      amount: "$2,500",
      riskScore: 0.92,
      description: "Login from foreign IP followed by immediate large transaction"
    },
    {
      id: "CASE-2024-003",
      title: "Card Skimming Pattern",
      status: "PENDING",
      priority: "MEDIUM",
      assignedTo: "Mike Detective",
      createdAt: "2024-01-25T08:15:00Z",
      updatedAt: "2024-01-25T08:15:00Z",
      transactionId: "txn_345678",
      amount: "$780",
      riskScore: 0.65,
      description: "Transaction pattern consistent with card skimming at ATM location"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INVESTIGATING': return 'bg-blue-500 text-white';
      case 'RESOLVED': return 'bg-green-500 text-white';
      case 'PENDING': return 'bg-yellow-500 text-white';
      case 'ESCALATED': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <h1 className="text-3xl font-bold">Case Management</h1>
            <p className="text-muted-foreground">Manage fraud investigation cases and track progress</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Case
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
                    placeholder="Search cases by ID, title, or transaction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="ESCALATED">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Case Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                {cases.filter(c => c.status === 'INVESTIGATING').length}
              </div>
              <p className="text-sm text-muted-foreground">Active Investigations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {cases.filter(c => c.status === 'PENDING').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {cases.filter(c => c.status === 'RESOLVED').length}
              </div>
              <p className="text-sm text-muted-foreground">Resolved Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {cases.filter(c => c.priority === 'CRITICAL').length}
              </div>
              <p className="text-sm text-muted-foreground">Critical Priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Cases ({filteredCases.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cases match your current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCases.map((caseItem) => (
                  <div key={caseItem.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(caseItem.status)}>
                            {caseItem.status}
                          </Badge>
                          <Badge className={getPriorityColor(caseItem.priority)}>
                            {caseItem.priority}
                          </Badge>
                          <span className="font-mono text-sm">{caseItem.id}</span>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{caseItem.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{caseItem.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Transaction:</span>
                            <p className="font-mono">{caseItem.transactionId}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-semibold">{caseItem.amount}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Risk Score:</span>
                            <p className="font-semibold">{(caseItem.riskScore * 100).toFixed(0)}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Assigned To:</span>
                            <p>{caseItem.assignedTo}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created: {formatTimeAgo(caseItem.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Updated: {formatTimeAgo(caseItem.updatedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          Report
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

export default Cases;
