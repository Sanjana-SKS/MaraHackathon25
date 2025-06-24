import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, TrendingUp, Settings, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { optimizationService, OptimizationResult, OptimizationData } from '@/services/optimizationService';

const OptimizationPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [optimizationData, setOptimizationData] = useState<OptimizationData | null>(null);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const runOptimization = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Calculate total profit
        const profit = optimizationService.calculateTotalProfit(data.results, data.data);
        setTotalProfit(profit);
        
        toast({
          title: "Optimization Complete!",
          description: `Found optimal configuration with ${data.results.length} active devices.`,
        });
      } else {
        throw new Error('Optimization failed');
      }
      
    } catch (error) {
      console.error('Optimization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Optimization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceInfo = (device: string) => {
    return optimizationService.getDeviceInfo(device);
  };

  const getSiteDisplayName = (siteCode: string) => {
    const siteNames: Record<string, string> = {
      'TX': 'Texas',
      'CA': 'California', 
      'NV': 'Nevada',
      'WY': 'Wyoming',
      'OH': 'Ohio',
      'MT': 'Montana'
    };
    return siteNames[siteCode] || siteCode;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-golden">Mining Optimization</h2>
          <p className="text-muted-foreground">
            Optimize device allocation across all mining sites using real-time data
          </p>
        </div>
        <Button
          onClick={runOptimization}
          disabled={isLoading}
          className="bg-gradient-to-r from-golden to-lime text-black font-semibold hover:from-lime hover:to-golden"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run Optimization
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Optimization Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizationResults.length > 0 && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-golden/30">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-golden" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Devices</p>
                  <p className="text-2xl font-bold text-golden">{optimizationResults.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-lime/30">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-lime" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold text-lime">${totalProfit.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-energy-blue/30">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-energy-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Sites Optimized</p>
                  <p className="text-2xl font-bold text-energy-blue">
                    {new Set(optimizationResults.map(r => r.site)).size}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-golden/30">
            <h3 className="text-lg font-semibold text-golden mb-4">Optimal Configuration</h3>
            
            <div className="space-y-4">
              {optimizationResults.map((result) => {
                const deviceInfo = getDeviceInfo(result.device);
                return (
                  <div
                    key={`${result.site}-${result.device}`}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${deviceInfo.color} flex items-center justify-center text-white text-lg`}>
                        {deviceInfo.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {getSiteDisplayName(result.site)} - {deviceInfo.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deviceInfo.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-golden/20 text-golden text-lg px-3 py-1">
                        {result.count} units
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Optimization Parameters */}
          {optimizationData && (
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-golden/30">
              <h3 className="text-lg font-semibold text-golden mb-4">Optimization Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sites</p>
                  <p className="font-mono text-foreground">
                    {optimizationData.sites.map(getSiteDisplayName).join(', ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Devices</p>
                  <p className="font-mono text-foreground">
                    {optimizationData.devices.map(d => getDeviceInfo(d).name).join(', ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Time Periods</p>
                  <p className="font-mono text-foreground">{optimizationData.T}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Energy Budget</p>
                  <p className="font-mono text-foreground">${optimizationData.E_BUDGET.toLocaleString()}</p>
                </div>
              </div>

              {/* Price Information */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-md font-semibold text-golden mb-3">Current Market Prices</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Hash Price</p>
                    <p className="font-mono text-foreground">
                      ${(optimizationData.h.reduce((a, b) => a + b, 0) / optimizationData.h.length).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Token Price</p>
                    <p className="font-mono text-foreground">
                      ${(optimizationData.g.reduce((a, b) => a + b, 0) / optimizationData.g.length).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Energy Price</p>
                    <p className="font-mono text-foreground">
                      ${(Object.values(optimizationData.e).flat().reduce((a: number, b: number) => a + b, 0) / Object.values(optimizationData.e).flat().length).toFixed(3)}/kWh
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && optimizationResults.length === 0 && !error && (
        <Card className="p-8 bg-card/80 backdrop-blur-sm border-golden/30">
          <div className="text-center">
            <Zap className="w-12 h-12 text-golden mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-golden mb-2">Ready to Optimize</h3>
            <p className="text-muted-foreground mb-4">
              Click the "Run Optimization" button to find the optimal device allocation across all mining sites.
            </p>
            <p className="text-sm text-muted-foreground">
              This will analyze energy prices, hash rates, and site capacities to maximize profitability.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OptimizationPanel; 