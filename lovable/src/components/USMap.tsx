
import React from 'react';

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
}

interface USMapProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
  overlayMode: string;
}

const USMap: React.FC<USMapProps> = ({ sites, onSiteClick, overlayMode }) => {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectToSVG = (lat: number, lng: number) => {
    // Simple Mercator-like projection for US bounds
    const x = ((lng + 125) / 58) * 800; // Rough US longitude range
    const y = ((50 - lat) / 25) * 500; // Rough US latitude range
    return { x, y };
  };

  const getStatusColor = (site: Site) => {
    switch (site.status) {
      case 'optimal': return '#A9F43A'; // lime
      case 'high-load': return '#FFC300'; // golden
      case 'warning': return '#FF6B35'; // warning-orange
      case 'high-carbon': return '#FF0000'; // red
      default: return '#FFC300';
    }
  };

  const getTooltipData = (site: Site, mode: string) => {
    switch (mode) {
      case 'profit':
        return `$${site.profitPerWatt.toFixed(4)}/W`;
      case 'carbon':
        return `${site.carbonIntensity.toFixed(2)} lbs/MWh`;
      case 'energy':
        return `$${site.energyPrice.toFixed(3)}/kWh`;
      default:
        return `$${site.profitPerWatt.toFixed(4)}/W`;
    }
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-background via-background/95 to-background grid-bg">
      {/* US Map SVG */}
      <svg 
        viewBox="0 0 800 500" 
        className="w-full h-full opacity-20"
        style={{ filter: 'drop-shadow(0 0 10px rgba(255, 195, 0, 0.3))' }}
      >
        {/* Simplified US outline */}
        <path
          d="M 100 200 L 700 200 L 700 350 L 100 350 Z M 150 360 L 250 400 L 350 380 L 150 360 M 600 380 L 680 390 L 680 420 L 600 420 Z"
          stroke="rgba(255, 195, 0, 0.5)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
        
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 195, 0, 0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Site Nodes */}
      <div className="absolute inset-0">
        {sites.map((site) => {
          const { x, y } = projectToSVG(site.lat, site.lng);
          const scaleFactor = 800 / window.innerWidth || 1;
          
          return (
            <div
              key={site.id}
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

              {/* Tooltip */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="bg-card/95 backdrop-blur-sm border border-golden/30 rounded-lg p-3 min-w-[200px] shadow-lg">
                  <div className="font-semibold text-golden text-sm">{site.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{site.state}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Profit/Watt:</span>
                      <span className="text-lime font-mono">${site.profitPerWatt.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Power Usage:</span>
                      <span className="text-golden font-mono">{site.powerUsed}MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbon:</span>
                      <span className="text-neon-green font-mono">{site.carbonIntensity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="text-golden font-mono">${site.revenue.toLocaleString()}/hr</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    Click for details →
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
        })}
      </div>

      {/* Floating Energy Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent animate-data-flow"
            style={{
              top: `${20 + i * 80}px`,
              animationDuration: `${3 + i}s`,
              animationDelay: `${i * 0.8}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default USMap;
