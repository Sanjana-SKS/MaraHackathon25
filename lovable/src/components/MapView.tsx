
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Globe } from 'lucide-react';
import USMapboxMap from '@/components/USMapboxMap';
import SiteDetailPanel from '@/components/SiteDetailPanel';
import AddSiteDialog from '@/components/AddSiteDialog';
import { Site } from '@/types/site';

interface MapViewProps {
  sites: Site[];
  selectedSite: Site | null;
  onSiteClick: (site: Site) => void;
  onCloseSitePanel: () => void;
  mapView: string;
  onMapViewChange: (view: string) => void;
  overlayMode: string;
  onAddSite: (site: Site) => void;
}

const MapView: React.FC<MapViewProps> = ({
  sites,
  selectedSite,
  onSiteClick,
  onCloseSitePanel,
  mapView,
  onMapViewChange,
  overlayMode,
  onAddSite
}) => {
  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex gap-2">
          <Button
            variant={mapView === 'us' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onMapViewChange('us')}
            className="bg-card/80 backdrop-blur-sm border-golden/30 hover:border-golden"
          >
            <MapPin className="w-4 h-4 mr-1" />
            US Map
          </Button>
          <Button
            variant={mapView === 'global' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onMapViewChange('global')}
            className="bg-card/80 backdrop-blur-sm border-golden/30 hover:border-golden"
          >
            <Globe className="w-4 h-4 mr-1" />
            Global
          </Button>
        </div>

        {/* Add Site Button */}
        <div className="absolute top-4 right-4 z-[1000]">
          <AddSiteDialog onAddSite={onAddSite} />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000]">
          <Card className="bg-card/80 backdrop-blur-sm border-golden/30 p-3">
            <div className="text-xs font-mono text-muted-foreground mb-2">
              Site Status Legend
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-lime"></div>
                <span>Optimal Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-golden"></div>
                <span>High Load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Carbon</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Mapbox Map Component */}
        <USMapboxMap 
          sites={sites}
          onSiteClick={onSiteClick}
          overlayMode={overlayMode}
        />
      </div>

      {/* Site Detail Panel */}
      {selectedSite && (
        <SiteDetailPanel 
          site={selectedSite}
          onClose={onCloseSitePanel}
        />
      )}
    </div>
  );
};

export default MapView;
