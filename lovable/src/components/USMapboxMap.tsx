
import React from 'react';
import { Site } from '@/types/site';
import SiteMarker from './SiteMarker';
import MapBackground from './MapBackground';

interface USMapboxMapProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
  overlayMode: string;
}

const USMapboxMap: React.FC<USMapboxMapProps> = ({ sites, onSiteClick, overlayMode }) => {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-background via-background/95 to-background overflow-hidden">
      {/* Static USA SVG Map Background */}
      <MapBackground />

      {/* Site Markers */}
      <div className="absolute inset-0">
        {sites.map((site) => (
          <SiteMarker
            key={site.id}
            site={site}
            onSiteClick={onSiteClick}
          />
        ))}
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

export default USMapboxMap;
