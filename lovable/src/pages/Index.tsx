
import React, { useState } from 'react';
import HeaderNav from '@/components/HeaderNav';
import GlobalStats from '@/components/GlobalStats';
import APIExplorer from '@/components/APIExplorer';
import ForecastModels from '@/components/ForecastModels';
import SitesList from '@/components/SitesList';
import AdminDashboard from '@/components/AdminDashboard';
import MapView from '@/components/MapView';
import { mockSites as initialMockSites } from '@/data/mockSites';
import { Site } from '@/types/site';

const Index = () => {
  const [sites, setSites] = useState<Site[]>(initialMockSites);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mapView, setMapView] = useState('us'); // 'us' or 'global'
  const [overlayMode, setOverlayMode] = useState('profit'); // 'profit', 'carbon', 'energy'
  const [activeTab, setActiveTab] = useState('map');

  const handleAddSite = (newSite: Site) => {
    setSites(prevSites => [...prevSites, newSite]);
    console.log('New site added:', newSite);
  };

  const totalRevenue = sites.reduce((sum, site) => sum + site.revenue, 0);
  const totalCapacity = sites.reduce((sum, site) => sum + site.powerCapacity, 0);
  const totalUsed = sites.reduce((sum, site) => sum + site.powerUsed, 0);
  const avgCarbonIntensity = sites.reduce((sum, site) => sum + site.carbonIntensity, 0) / sites.length;

  const renderMainContent = () => {
    switch (activeTab) {
      case 'api':
        return <APIExplorer sites={sites} />;
      case 'forecast':
        return <ForecastModels />;
      case 'sites':
        return (
          <SitesList 
            sites={sites}
            onSiteClick={setSelectedSite}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            totalSites={sites.length}
          />
        );
      default:
        return (
          <MapView
            sites={sites}
            selectedSite={selectedSite}
            onSiteClick={setSelectedSite}
            onCloseSitePanel={() => setSelectedSite(null)}
            mapView={mapView}
            onMapViewChange={setMapView}
            overlayMode={overlayMode}
            onAddSite={handleAddSite}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Global Stats Bar */}
      <GlobalStats 
        totalRevenue={totalRevenue}
        totalCapacity={totalCapacity}
        totalUsed={totalUsed}
        avgCarbonIntensity={avgCarbonIntensity}
        activeSites={sites.length}
      />

      {renderMainContent()}
    </div>
  );
};

export default Index;
