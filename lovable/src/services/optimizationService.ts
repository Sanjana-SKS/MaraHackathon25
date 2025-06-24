import { mockSites } from '@/data/mockSites';

// Types for optimization
export interface OptimizationResult {
  site: string;
  device: string;
  count: number;
  profit: number;
}

export interface OptimizationData {
  sites: string[];
  devices: string[];
  T: number;
  r_hash: Record<string, Record<string, number>>;
  r_tok: Record<string, Record<string, number>>;
  power: Record<string, Record<string, number>>;
  N: Record<string, Record<string, number>>;
  h: number[];
  g: number[];
  e: Record<string, number[]>;
  P_MAX: Record<string, number>;
  E_BUDGET: number;
}

export interface OptimizationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: OptimizationData;
  results?: OptimizationResult[];
  timestamp?: string;
}

class OptimizationService {
  private backendUrl = 'http://localhost:8000';

  async runOptimization(): Promise<OptimizationResponse> {
    try {
      // First get the optimization data from backend
      const dataResponse = await fetch(`${this.backendUrl}/optimization-data`);
      if (!dataResponse.ok) {
        throw new Error(`Failed to fetch optimization data: ${dataResponse.statusText}`);
      }
      
      const dataResult = await dataResponse.json();
      if (!dataResult.success) {
        throw new Error(dataResult.error || 'Failed to get optimization data');
      }

      // Now call the optimization endpoint
      const optimizationResponse = await fetch(`${this.backendUrl}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataResult.data),
      });

      if (!optimizationResponse.ok) {
        throw new Error(`Optimization failed: ${optimizationResponse.statusText}`);
      }

      const optimizationResult = await optimizationResponse.json();
      
      // Process the results into our format
      const results: OptimizationResult[] = [];
      if (optimizationResult.optimal_allocation) {
        for (const [site, devices] of Object.entries(optimizationResult.optimal_allocation)) {
          for (const [device, count] of Object.entries(devices as Record<string, number>)) {
            if (count > 0) {
              results.push({
                site: site as string,
                device: device as string,
                count: count as number,
                profit: this.calculateDeviceProfit(site as string, device as string, count as number, dataResult.data)
              });
            }
          }
        }
      }

      return {
        success: true,
        data: dataResult.data,
        results: results,
        message: optimizationResult.message || 'Optimization completed successfully'
      };

    } catch (error) {
      console.error('Optimization error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  calculateDeviceProfit(site: string, device: string, count: number, data: OptimizationData): number {
    // Simplified profit calculation
    const deviceInfo = this.getDeviceInfo(device);
    const siteData = mockSites.find(s => s.state.toLowerCase() === site.toLowerCase());
    
    if (!siteData) return 0;

    const powerConsumption = deviceInfo.power * count;
    const energyCost = powerConsumption * (siteData.energyPrice / 1000); // Convert to kWh
    
    // Simplified revenue calculation
    let revenue = 0;
    if (deviceInfo.type === 'mining') {
      revenue = deviceInfo.hashrate * count * 0.001; // Simplified hash revenue
    } else {
      revenue = deviceInfo.tokens * count * 0.01; // Simplified token revenue
    }

    return revenue - energyCost;
  }

  calculateTotalProfit(results: OptimizationResult[], data: OptimizationData): number {
    return results.reduce((total, result) => total + result.profit, 0);
  }

  getDeviceInfo(device: string) {
    const deviceMap: Record<string, any> = {
      'air': {
        name: 'Air Cooled Miner',
        description: 'Standard air-cooled mining rig',
        icon: '❄️',
        color: 'bg-blue-500',
        type: 'mining',
        hashrate: 1000,
        power: 3500,
        tokens: 0
      },
      'hydro': {
        name: 'Hydro Cooled Miner',
        description: 'Water-cooled mining system',
        icon: '💧',
        color: 'bg-cyan-500',
        type: 'mining',
        hashrate: 5000,
        power: 5000,
        tokens: 0
      },
      'immersion': {
        name: 'Immersion Miner',
        description: 'Oil-immersed cooling system',
        icon: '🛢️',
        color: 'bg-purple-500',
        type: 'mining',
        hashrate: 10000,
        power: 10000,
        tokens: 0
      },
      'gpu': {
        name: 'GPU Cluster',
        description: 'AI inference processing',
        icon: '🧠',
        color: 'bg-green-500',
        type: 'inference',
        hashrate: 0,
        power: 5000,
        tokens: 1000
      },
      'asic': {
        name: 'ASIC Array',
        description: 'Specialized AI hardware',
        icon: '⚡',
        color: 'bg-orange-500',
        type: 'inference',
        hashrate: 0,
        power: 15000,
        tokens: 500
      }
    };

    return deviceMap[device] || {
      name: 'Unknown Device',
      description: 'Unknown device type',
      icon: '❓',
      color: 'bg-gray-500',
      type: 'unknown',
      hashrate: 0,
      power: 0,
      tokens: 0
    };
  }

  // Get sites from mock data for display
  getSites() {
    return mockSites;
  }
}

export const optimizationService = new OptimizationService(); 