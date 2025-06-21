
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Copy, 
  TrendingUp, 
  Zap, 
  Cpu, 
  BarChart3, 
  Settings, 
  Shield,
  Activity,
  Thermometer,
  DollarSign,
  Leaf
} from 'lucide-react';

interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  profitPerWatt: number;
  carbonIntensity: number;
  powerCapacity: number;
  powerUsed: number;
  status: string;
  energyPrice: number;
  revenue: number;
  curtailmentRisk: string;
  weather: {
    windSpeed: number;
    solarIrradiance: number;
    temp: number;
    cloudCover: number;
  };
}

interface SiteDetailPanelProps {
  site: Site;
  onClose: () => void;
}

const SiteDetailPanel: React.FC<SiteDetailPanelProps> = ({ site, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const utilizationPercent = (site.powerUsed / site.powerCapacity) * 100;

  const copyAPIKey = async () => {
    await navigator.clipboard.writeText(`api_key_${site.id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'optimal': { color: 'bg-lime text-black', label: 'Optimal' },
      'high-load': { color: 'bg-golden text-black', label: 'High Load' },
      'warning': { color: 'bg-warning-orange text-white', label: 'Warning' },
      'high-carbon': { color: 'bg-red-500 text-white', label: 'High Carbon' }
    };
    
    const config = statusConfig[status] || statusConfig.optimal;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Generate the same data as in the hover popup
  const generateComputeData = (site: Site) => {
    const baseASIC = Math.floor(40 + Math.random() * 30);
    const baseGPU = Math.floor(20 + Math.random() * 25);
    const baseImmersion = Math.floor(5 + Math.random() * 15);
    
    return {
      asic: baseASIC,
      gpu: baseGPU,
      immersion: baseImmersion,
      total: baseASIC + baseGPU + baseImmersion
    };
  };

  const generateMinerTypes = () => {
    return {
      'Antminer S19': Math.floor(15 + Math.random() * 20),
      'Antminer S19 Pro': Math.floor(10 + Math.random() * 15),
      'Whatsminer M30S': Math.floor(8 + Math.random() * 12),
      'Avalon 1246': Math.floor(5 + Math.random() * 10),
      'RTX 4090': Math.floor(12 + Math.random() * 18),
      'RTX 3080': Math.floor(8 + Math.random() * 15)
    };
  };

  const createChartSVG = (data: any, type: 'donut' | 'bar') => {
    if (type === 'donut') {
      const { asic, gpu, immersion, total } = data;
      
      return `
        <svg width="120" height="120" viewBox="0 0 120 120" style="margin: 8px auto; display: block;">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#A9F43A" stroke-width="12" 
                  stroke-dasharray="${(asic/total) * 282.7} 282.7" transform="rotate(-90 60 60)"/>
          <circle cx="60" cy="60" r="45" fill="none" stroke="#FFC300" stroke-width="12" 
                  stroke-dasharray="${(gpu/total) * 282.7} 282.7" 
                  stroke-dashoffset="-${(asic/total) * 282.7}" transform="rotate(-90 60 60)"/>
          <circle cx="60" cy="60" r="45" fill="none" stroke="#00D9FF" stroke-width="12" 
                  stroke-dasharray="${(immersion/total) * 282.7} 282.7" 
                  stroke-dashoffset="-${((asic + gpu)/total) * 282.7}" transform="rotate(-90 60 60)"/>
          <text x="60" y="66" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${total}</text>
        </svg>
      `;
    } else {
      const maxValue = Math.max(...Object.values(data).map(val => Number(val)));
      let bars = '';
      let y = 15;
      
      Object.entries(data).forEach(([name, value]) => {
        const numValue = Number(value);
        const width = (numValue / maxValue) * 200;
        bars += `
          <rect x="15" y="${y}" width="${width}" height="18" fill="#A9F43A" opacity="0.8" rx="2"/>
          <text x="20" y="${y + 13}" fill="white" font-size="11">${name.split(' ')[0]} (${numValue})</text>
        `;
        y += 28;
      });
      
      return `<svg width="280" height="${y + 15}" viewBox="0 0 280 ${y + 15}">${bars}</svg>`;
    }
  };

  const computeData = generateComputeData(site);
  const minerData = generateMinerTypes();

  // Mock data for charts and details
  const computeAllocation = [
    { type: 'ASIC Miners', units: computeData.asic, power: 45, revenue: 2800, efficiency: '95%' },
    { type: 'GPU Rigs', units: computeData.gpu, power: 28, revenue: 1650, efficiency: '88%' },
    { type: 'Immersion Cooling', units: computeData.immersion, power: 14, revenue: 920, efficiency: '92%' }
  ];

  return (
    <div className="w-96 h-full bg-card/95 backdrop-blur-sm border-l border-border overflow-hidden flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-golden">{site.name}</h2>
            <p className="text-sm text-muted-foreground">{site.state} • Lat: {site.lat.toFixed(4)}, Lng: {site.lng.toFixed(4)}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">API Key:</span>
            <code className="text-xs bg-secondary px-2 py-1 rounded">api_key_{site.id}</code>
            <Button variant="ghost" size="sm" onClick={copyAPIKey}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          {getStatusBadge(site.status)}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total Capacity: <span className="text-golden font-semibold">{site.powerCapacity}MW</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 mx-4 mt-2">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="energy" className="text-xs">Energy</TabsTrigger>
          <TabsTrigger value="compute" className="text-xs">Compute</TabsTrigger>
          <TabsTrigger value="forecast" className="text-xs">Forecast</TabsTrigger>
          <TabsTrigger value="optimize" className="text-xs">Optimize</TabsTrigger>
          <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="overview" className="space-y-4 mt-0">
            {/* Real-time Profitability */}
            <Card className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-golden" />
                  Real-time Profitability
                </h3>
                <Badge className="bg-lime text-black text-xs">Live</Badge>
              </div>
              <div className="text-2xl font-bold text-golden mb-1">
                ${site.profitPerWatt.toFixed(4)} /W
              </div>
              <div className="text-sm text-muted-foreground">
                Revenue: ${site.revenue.toLocaleString()}/hr
              </div>
            </Card>

            {/* Power Usage */}
            <Card className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-lime" />
                  Power Usage
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{site.powerUsed}MW used</span>
                  <span>{utilizationPercent.toFixed(1)}%</span>
                </div>
                <Progress value={utilizationPercent} className="h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-lime to-golden rounded-full transition-all"
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </Progress>
                <div className="text-xs text-muted-foreground">
                  Capacity: {site.powerCapacity}MW
                </div>
              </div>
            </Card>

            {/* Carbon Intensity */}
            <Card className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-neon-green" />
                  Carbon Intensity
                </h3>
              </div>
              <div className="text-xl font-bold text-neon-green mb-1">
                {site.carbonIntensity.toFixed(2)} lbs/MWh
              </div>
              <div className="text-xs text-muted-foreground">
                {site.carbonIntensity < 0.5 ? 'Low carbon' : site.carbonIntensity < 0.7 ? 'Medium carbon' : 'High carbon'} energy mix
              </div>
            </Card>

            {/* Compute Mix Visualization - Same as hover popup */}
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-lime" />
                Compute Mix Distribution
              </h3>
              <div className="text-center mb-4">
                <div dangerouslySetInnerHTML={{ __html: createChartSVG(computeData, 'donut') }} />
                <div className="flex justify-center gap-4 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-lime rounded-full"></div>
                    <span>ASIC ({computeData.asic})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-golden rounded-full"></div>
                    <span>GPU ({computeData.gpu})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-energy-blue rounded-full"></div>
                    <span>Immersion ({computeData.immersion})</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Weather Data */}
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-energy-blue" />
                Weather Conditions
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Temperature:</span>
                  <div className="font-mono text-golden">{site.weather.temp}°F</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Wind Speed:</span>
                  <div className="font-mono text-lime">{site.weather.windSpeed}mph</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Solar Irradiance:</span>
                  <div className="font-mono text-golden">{site.weather.solarIrradiance}W/m²</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Cloud Cover:</span>
                  <div className="font-mono text-energy-blue">{site.weather.cloudCover}%</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-4 mt-0">
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">Energy Price Trend</h3>
              <div className="text-xl font-bold text-energy-blue mb-2">
                ${site.energyPrice.toFixed(3)} /kWh
              </div>
              <div className="h-24 bg-secondary/50 rounded flex items-end justify-center">
                <div className="text-xs text-muted-foreground">Price chart placeholder</div>
              </div>
            </Card>

            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">Energy Source Mix</h3>
              <div className="space-y-2">
                {[
                  { source: 'Solar', percent: 35, color: 'bg-golden' },
                  { source: 'Wind', percent: 25, color: 'bg-lime' },
                  { source: 'Natural Gas', percent: 30, color: 'bg-blue-500' },
                  { source: 'Coal', percent: 10, color: 'bg-gray-500' }
                ].map(({ source, percent, color }) => (
                  <div key={source} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm flex-1">{source}</span>
                    <span className="text-sm font-mono">{percent}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compute" className="space-y-4 mt-0">
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">Compute Allocation</h3>
              <div className="space-y-3">
                {computeAllocation.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.type}</span>
                      <Badge variant="outline">{item.efficiency}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Units</div>
                        <div className="font-mono">{item.units}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Power</div>
                        <div className="font-mono">{item.power}MW</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Revenue</div>
                        <div className="font-mono text-golden">${item.revenue}</div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Miners Chart - Same as hover popup */}
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">Active Miners Distribution</h3>
              <div dangerouslySetInnerHTML={{ __html: createChartSVG(minerData, 'bar') }} />
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4 mt-0">
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">Price Forecasting</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Next 30 minutes</div>
                  <div className="text-lime font-semibold">+12.5% profit increase expected</div>
                </div>
                <div className="h-32 bg-secondary/50 rounded flex items-center justify-center">
                  <div className="text-xs text-muted-foreground">Forecast chart placeholder</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4 mt-0">
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">AI Optimization</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-optimization</span>
                  <Badge className="bg-lime text-black">Enabled</Badge>
                </div>
                <Button className="w-full bg-golden text-black hover:bg-golden/80">
                  Apply Recommended Allocation
                </Button>
                <div className="text-xs text-muted-foreground">
                  Projected +8.3% revenue increase
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4 mt-0">
            <Card className="metric-card">
              <h3 className="text-sm font-semibold mb-3">Site Administration</h3>
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <div><span className="text-muted-foreground">Site ID:</span> {site.id}</div>
                  <div><span className="text-muted-foreground">Region:</span> {site.state}</div>
                  <div><span className="text-muted-foreground">Created:</span> 2024-01-15</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Download Site Report
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full">
                    Reset Site
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SiteDetailPanel;
