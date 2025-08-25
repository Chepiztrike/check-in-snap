import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getIncompleteClients, 
  cleanupPendingClients, 
  getClientStats,
  type ClientSummary 
} from '@/utils/clientDataUtils';

interface ClientStats {
  total: number;
  pending: number;
  complete: number;
  completionRate: number;
}

export const DataQualityDashboard: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [incompleteClients, setIncompleteClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, incompleteData] = await Promise.all([
        getClientStats(),
        getIncompleteClients()
      ]);
      
      setStats(statsData);
      setIncompleteClients(incompleteData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data quality information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    setCleanupLoading(true);
    try {
      const cleanedCount = await cleanupPendingClients();
      
      toast({
        title: "Cleanup Complete",
        description: `Removed ${cleanedCount} old pending client records`,
        variant: "default"
      });
      
      // Reload data
      await loadData();
    } catch (error) {
      toast({
        title: "Cleanup Failed",
        description: "Could not clean up pending records",
        variant: "destructive"
      });
    } finally {
      setCleanupLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading data quality information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            Data Quality Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor and manage client data completeness</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleCleanup} 
            variant="destructive" 
            size="sm"
            disabled={cleanupLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {cleanupLoading ? 'Cleaning...' : 'Cleanup Old Records'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Complete Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Incomplete Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completionRate.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Incomplete Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Incomplete Client Records
          </CardTitle>
          <CardDescription>
            These client records need customer information to be completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {incompleteClients.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All client records are complete!</p>
              <p className="text-muted-foreground">No pending or incomplete client data found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incompleteClients.map((client) => (
                <div 
                  key={client.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {client.client_number}
                    </Badge>
                    <div>
                      <p className="font-medium">
                        {client.customer_name || 'Pending'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(client.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {client.has_checkin ? (
                      <Badge variant="default">Has Check-in</Badge>
                    ) : (
                      <Badge variant="secondary">No Check-in</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Data Quality Improvements:</strong> The system now prevents creation of incomplete client records. 
          Existing incomplete records will be automatically prompted for completion when accessed in Parts Service or Checkout workflows.
        </AlertDescription>
      </Alert>
    </div>
  );
};