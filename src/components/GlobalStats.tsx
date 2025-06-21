
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Zap, Leaf, Activity } from 'lucide-react';

interface GlobalStatsProps {
  totalRevenue: number;
  totalCapacity: number;
  totalUsed: number;
  avgCarbonIntensity: number;
  activeSites: number;
}

const GlobalStats: React.FC<GlobalStatsProps> = ({
  totalRevenue,
  totalCapacity,
  totalUsed,
  avgCarbonIntensity,
  activeSites
}) => {
  const utilizationPercent = (totalUsed / totalCapacity) * 100;

  return (
    <div className="bg-card/40 backdrop-blur-sm border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Total Revenue */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-golden" />
            <div>
              <div className="text-sm font-mono text-muted-foreground">Total Revenue</div>
              <div className="text-lg font-bold text-golden">
                ${totalRevenue.toLocaleString()}/hr
              </div>
            </div>
          </div>

          {/* Power Utilization */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-lime" />
            <div>
              <div className="text-sm font-mono text-muted-foreground">Power Usage</div>
              <div className="text-lg font-bold text-lime">
                {totalUsed.toFixed(0)}MW / {totalCapacity}MW
              </div>
              <div className="text-xs text-muted-foreground">
                {utilizationPercent.toFixed(1)}% utilization
              </div>
            </div>
          </div>

          {/* Carbon Intensity */}
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-neon-green" />
            <div>
              <div className="text-sm font-mono text-muted-foreground">Avg Carbon</div>
              <div className="text-lg font-bold text-neon-green">
                {avgCarbonIntensity.toFixed(2)} lbs/MWh
              </div>
            </div>
          </div>

          {/* Active Sites */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-energy-blue" />
            <div>
              <div className="text-sm font-mono text-muted-foreground">Active Sites</div>
              <div className="text-lg font-bold text-energy-blue">
                {activeSites} sites
              </div>
            </div>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-lime rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-muted-foreground">
            Live data • Updated 5s ago
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalStats;
