
import React from 'react';
import { Card } from '@/components/ui/card';
import { Site } from '@/types/site';

interface SitesListProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
}

const SitesList: React.FC<SitesListProps> = ({ sites, onSiteClick }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-golden mb-4">Sites List View</h2>
      <div className="grid gap-4">
        {sites.map(site => (
          <Card key={site.id} className="metric-card p-4 cursor-pointer hover:border-golden/50" onClick={() => onSiteClick(site)}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-golden">{site.name}</h3>
                <p className="text-sm text-muted-foreground">{site.state}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-lime">${site.profitPerWatt.toFixed(4)}/W</p>
                <p className="text-sm text-muted-foreground">{site.powerUsed}MW / {site.powerCapacity}MW</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SitesList;
