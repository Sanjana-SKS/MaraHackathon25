
import React from 'react';
import { Site } from '@/types/site';
import { projectToSVG, getStatusColor, generateComputeData, generateMinerTypes } from '@/utils/mapUtils';
import MapCharts from './MapCharts';

interface SiteMarkerProps {
  site: Site;
  onSiteClick: (site: Site) => void;
}

const SiteMarker: React.FC<SiteMarkerProps> = ({ site, onSiteClick }) => {
  const { x, y } = projectToSVG(site.lat, site.lng);
  const computeData = generateComputeData(site);
  const minerData = generateMinerTypes();

  return (
    <div
      className="absolute group cursor-pointer"
      style={{
        left: `${(x / 800) * 100}%`,
        top: `${(y / 500) * 100}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => onSiteClick(site)}
    >
      {/* Site Node */}
      <div 
        className="site-node"
        style={{ 
          backgroundColor: getStatusColor(site),
          boxShadow: `0 0 15px ${getStatusColor(site)}80, 0 0 30px ${getStatusColor(site)}40`
        }}
      >
        {/* Pulsing ring */}
        <div 
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: getStatusColor(site) }}
        ></div>
      </div>

      {/* Enhanced Tooltip with Charts - positioned to appear above search area */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[2000]">
        <div className="bg-card/95 backdrop-blur-sm border border-golden/30 rounded-lg p-4 min-w-[320px] shadow-xl">
          <div className="flex items-center justify-space-between mb-3">
            <div>
              <div className="font-semibold text-golden text-lg">{site.name}</div>
              <div className="text-xs text-muted-foreground">{site.state} • {site.id}</div>
            </div>
            <div 
              className="w-4 h-4 rounded-full ml-auto"
              style={{ backgroundColor: getStatusColor(site) }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Profit/Watt:</span>
                <span className="text-lime font-mono font-bold">${site.profitPerWatt.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Power Usage:</span>
                <span className="text-golden font-mono">{site.powerUsed}MW/{site.powerCapacity}MW</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="text-lime font-mono">${site.revenue.toLocaleString()}/hr</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Carbon:</span>
                <span className="text-neon-green font-mono">{site.carbonIntensity.toFixed(2)}</span>
              </div>
            </div>
            
            <MapCharts computeData={computeData} minerData={minerData} />
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
            <div className="text-xs text-muted-foreground">
              Weather: {site.weather.temp}°F, {site.weather.windSpeed}mph
            </div>
            <div className="text-xs text-golden font-medium">
              Click for details →
            </div>
          </div>
        </div>
      </div>

      {/* Data streams */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-px bg-gradient-to-r from-transparent via-golden to-transparent opacity-60 animate-data-flow"
            style={{
              top: `${-10 + i * 4}px`,
              left: '50%',
              animationDelay: `${i * 0.5}s`,
              transform: 'translateX(-50%)'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SiteMarker;
