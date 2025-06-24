import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  Play, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Site {
  id: number;
  name: string;
  state: string;
  curtailmentRisk: string;
}

interface APIExplorerProps {
  sites: Site[];
}

const APIExplorer: React.FC<APIExplorerProps> = ({ sites }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('curtailment');
  const [selectedSite, setSelectedSite] = useState('all');
  const [optimizationTarget, setOptimizationTarget] = useState('profit');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      key: 'curtailment',
      name: '/predict-curtailment',
      method: 'GET',
      description: 'Predicts next curtailment event per site',
      params: ['site_id (optional)']
    },
    {
      key: 'optimize',
      name: '/optimize-site',
      method: 'POST',
      description: 'Recommends machine allocation for optimal performance',
      params: ['site_id', 'target (profit|efficiency)']
    },
    {
      key: 'forecast',
      name: '/forecast-prices',
      method: 'GET',
      description: 'Returns price forecasts for energy, hash, and tokens',
      params: ['horizon (15m|30m|1h)', 'metrics']
    }
  ];

  const mockAPICall = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let mockResponse = {};
    
    switch (selectedEndpoint) {
      case 'curtailment':
        mockResponse = {
          site_id: selectedSite === 'all' ? 'site-001' : selectedSite,
          next_curtailment: {
            predicted_time: '2024-01-15T14:30:00Z',
            probability: 0.73,
            duration_hours: 2.5,
            factors: {
              weather: 'High wind forecast',
              grid_signals: 'Peak demand period',
              power_threshold: 'Approaching 95% capacity'
            }
          },
          recommendation: 'Reduce load by 15% starting 13:45 UTC'
        };
        break;
      case 'optimize':
        mockResponse = {
          site_id: selectedSite === 'all' ? 'site-001' : selectedSite,
          current_allocation: {
            asic_miners: 60,
            gpu_rigs: 25,
            immersion_cooling: 15
          },
          recommended_allocation: {
            asic_miners: 45,
            gpu_rigs: 35,
            immersion_cooling: 20
          },
          expected_profit_delta: '+$1,247/hour',
          confidence: 0.87
        };
        break;
      case 'forecast':
        mockResponse = {
          timestamp: '2024-01-15T09:14:23Z',
          horizon: '1h',
          forecasts: {
            energy_price: {
              current: 0.045,
              predicted: 0.052,
              confidence_interval: [0.048, 0.057],
              trend: 'increasing'
            },
            hash_price: {
              current: 0.0234,
              predicted: 0.0267,
              confidence_interval: [0.0245, 0.0289],
              trend: 'increasing'
            },
            token_price: {
              current: 43250,
              predicted: 44100,
              confidence_interval: [43800, 44500],
              trend: 'stable'
            }
          }
        };
        break;
    }
    
    setApiResponse(JSON.stringify(mockResponse, null, 2));
    setLoading(false);
  };

  const getCurrentEndpoint = () => {
    return endpoints.find(ep => ep.key === selectedEndpoint);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-golden mb-2">API Explorer</h2>
        <p className="text-muted-foreground">
          Interactive interface for site-level and global API endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <Card className="metric-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-golden" />
            <h3 className="text-lg font-semibold">API Request</h3>
          </div>

          <div className="space-y-4">
            {/* Endpoint Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Endpoint</label>
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger className="bg-secondary border-golden/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-golden/30">
                  {endpoints.map(endpoint => (
                    <SelectItem key={endpoint.key} value={endpoint.key}>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-lime text-black text-xs">{endpoint.method}</Badge>
                        <span className="font-mono text-sm">{endpoint.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Endpoint Info */}
            {getCurrentEndpoint() && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {getCurrentEndpoint()?.description}
                </p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Parameters: </span>
                  <span className="font-mono">{getCurrentEndpoint()?.params.join(', ')}</span>
                </div>
              </div>
            )}

            {/* Parameters */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Parameters</label>
              
              {(selectedEndpoint === 'curtailment' || selectedEndpoint === 'optimize') && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Site ID</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger className="bg-secondary/50 border-golden/20">
                      <SelectValue placeholder="Select site (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-golden/30">
                      <SelectItem value="all">All sites</SelectItem>
                      {sites.map(site => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name} ({site.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedEndpoint === 'optimize' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Optimization Target</label>
                  <Select value={optimizationTarget} onValueChange={setOptimizationTarget}>
                    <SelectTrigger className="bg-secondary/50 border-golden/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-golden/30">
                      <SelectItem value="profit">Maximize Profit</SelectItem>
                      <SelectItem value="efficiency">Maximize Efficiency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Execute Button */}
            <Button 
              onClick={mockAPICall} 
              disabled={loading}
              className="w-full bg-golden text-black hover:bg-golden/80"
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? 'Executing...' : 'Execute Request'}
            </Button>
          </div>
        </Card>

        {/* Response Panel */}
        <Card className="metric-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              {apiResponse ? (
                <CheckCircle className="w-5 h-5 text-lime" />
              ) : (
                <Clock className="w-5 h-5 text-muted-foreground" />
              )}
              <h3 className="text-lg font-semibold">API Response</h3>
            </div>
            {apiResponse && (
              <Badge className="bg-lime text-black text-xs">200 OK</Badge>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Executing API request...</p>
                </div>
              </div>
            ) : apiResponse ? (
              <div className="bg-background/50 rounded-lg p-4 border border-golden/20">
                <pre className="text-xs font-mono overflow-x-auto text-lime">
                  {apiResponse}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Execute a request to see the response</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Curtailment Predictions Table */}
      {selectedEndpoint === 'curtailment' && (
        <Card className="metric-card p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-golden" />
            Active Curtailment Predictions
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Site</th>
                  <th className="text-left py-2">Risk Level</th>
                  <th className="text-left py-2">Next Event</th>
                  <th className="text-left py-2">Probability</th>
                  <th className="text-left py-2">Factors</th>
                </tr>
              </thead>
              <tbody>
                {sites.map(site => (
                  <tr key={site.id} className="border-b border-border/50">
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-xs text-muted-foreground">{site.id}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge className={
                        site.curtailmentRisk === 'high' ? 'bg-red-500 text-white' :
                        site.curtailmentRisk === 'medium' ? 'bg-golden text-black' :
                        'bg-lime text-black'
                      }>
                        {site.curtailmentRisk}
                      </Badge>
                    </td>
                    <td className="py-3 font-mono text-xs">
                      {site.curtailmentRisk === 'high' ? '14:30 UTC' : 
                       site.curtailmentRisk === 'medium' ? '18:45 UTC' : 'None predicted'}
                    </td>
                    <td className="py-3 font-mono">
                      {site.curtailmentRisk === 'high' ? '73%' : 
                       site.curtailmentRisk === 'medium' ? '31%' : '8%'}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {site.curtailmentRisk === 'high' ? 'High wind, peak demand' : 
                       site.curtailmentRisk === 'medium' ? 'Grid signals' : 'Stable conditions'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default APIExplorer;
