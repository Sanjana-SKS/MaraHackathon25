
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Site } from '@/types/site';

interface AddSiteDialogProps {
  onAddSite: (site: Site) => void;
}

const AddSiteDialog: React.FC<AddSiteDialogProps> = ({ onAddSite }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    lat: '',
    lng: '',
    powerCapacity: '',
    energyPrice: '',
    // Inference data
    asicMaxMachines: '',
    asicPower: '',
    asicTokens: '',
    gpuMaxMachines: '',
    // Miners data
    airMaxMachines: '',
    hydroMaxMachines: '',
    immersionMaxMachines: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new site ID
    const newSiteId = `site-${Date.now()}`;
    
    // Calculate some derived values
    const powerCapacity = parseFloat(formData.powerCapacity) || 100;
    const powerUsed = Math.floor(powerCapacity * (0.5 + Math.random() * 0.4)); // Random usage between 50-90%
    const profitPerWatt = 0.015 + Math.random() * 0.015; // Random profit between 0.015-0.03
    const carbonIntensity = 0.2 + Math.random() * 0.6; // Random carbon intensity
    
    const newSite: Site = {
      id: newSiteId,
      name: formData.name,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      state: formData.state,
      profitPerWatt,
      carbonIntensity,
      powerCapacity,
      powerUsed,
      status: 'optimal',
      energyPrice: parseFloat(formData.energyPrice) || 0.05,
      revenue: Math.floor(powerUsed * 100 * profitPerWatt),
      curtailmentRisk: 'low',
      weather: {
        windSpeed: Math.floor(5 + Math.random() * 15),
        solarIrradiance: Math.floor(600 + Math.random() * 400),
        temp: Math.floor(60 + Math.random() * 40),
        cloudCover: Math.floor(Math.random() * 60)
      }
    };

    onAddSite(newSite);
    setOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      state: '',
      lat: '',
      lng: '',
      powerCapacity: '',
      energyPrice: '',
      asicMaxMachines: '',
      asicPower: '',
      asicTokens: '',
      gpuMaxMachines: '',
      airMaxMachines: '',
      hydroMaxMachines: '',
      immersionMaxMachines: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-golden text-black hover:bg-golden/80"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Site
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-golden">Add New Site</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Site Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-golden">Site Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Texas Solar Farm Beta"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Texas"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => handleInputChange('lat', e.target.value)}
                  placeholder="32.7767"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => handleInputChange('lng', e.target.value)}
                  placeholder="-96.7970"
                  required
                />
              </div>
              <div>
                <Label htmlFor="powerCapacity">Power Capacity (MW)</Label>
                <Input
                  id="powerCapacity"
                  type="number"
                  value={formData.powerCapacity}
                  onChange={(e) => handleInputChange('powerCapacity', e.target.value)}
                  placeholder="150"
                  required
                />
              </div>
              <div>
                <Label htmlFor="energyPrice">Energy Price ($/kWh)</Label>
                <Input
                  id="energyPrice"
                  type="number"
                  step="0.001"
                  value={formData.energyPrice}
                  onChange={(e) => handleInputChange('energyPrice', e.target.value)}
                  placeholder="0.045"
                  required
                />
              </div>
            </div>
          </div>

          {/* Inference Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-golden">Inference Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-lime">ASIC</h4>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="asicMaxMachines">Max Machines</Label>
                    <Input
                      id="asicMaxMachines"
                      type="number"
                      value={formData.asicMaxMachines}
                      onChange={(e) => handleInputChange('asicMaxMachines', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="asicPower">Power</Label>
                    <Input
                      id="asicPower"
                      type="number"
                      value={formData.asicPower}
                      onChange={(e) => handleInputChange('asicPower', e.target.value)}
                      placeholder="3500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="asicTokens">Tokens</Label>
                    <Input
                      id="asicTokens"
                      type="number"
                      value={formData.asicTokens}
                      onChange={(e) => handleInputChange('asicTokens', e.target.value)}
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-lime">GPU</h4>
                <div>
                  <Label htmlFor="gpuMaxMachines">Max Machines</Label>
                  <Input
                    id="gpuMaxMachines"
                    type="number"
                    value={formData.gpuMaxMachines}
                    onChange={(e) => handleInputChange('gpuMaxMachines', e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Power: 5000 (fixed)<br/>
                  Tokens: 1000 (fixed)
                </div>
              </div>
            </div>
          </div>

          {/* Miners Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-golden">Miners Configuration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-lime mb-2">Air Cooling</h4>
                <Label htmlFor="airMaxMachines">Max Machines</Label>
                <Input
                  id="airMaxMachines"
                  type="number"
                  value={formData.airMaxMachines}
                  onChange={(e) => handleInputChange('airMaxMachines', e.target.value)}
                  placeholder="75"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Hashrate: 1000 (fixed)<br/>
                  Power: 3500 (fixed)
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-lime mb-2">Hydro Cooling</h4>
                <Label htmlFor="hydroMaxMachines">Max Machines</Label>
                <Input
                  id="hydroMaxMachines"
                  type="number"
                  value={formData.hydroMaxMachines}
                  onChange={(e) => handleInputChange('hydroMaxMachines', e.target.value)}
                  placeholder="25"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Hashrate: 5000 (fixed)<br/>
                  Power: 5000 (fixed)
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-lime mb-2">Immersion Cooling</h4>
                <Label htmlFor="immersionMaxMachines">Max Machines</Label>
                <Input
                  id="immersionMaxMachines"
                  type="number"
                  value={formData.immersionMaxMachines}
                  onChange={(e) => handleInputChange('immersionMaxMachines', e.target.value)}
                  placeholder="10"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Hashrate: 10000 (fixed)<br/>
                  Power: 10000 (fixed)
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-golden text-black hover:bg-golden/80">
              Add Site
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSiteDialog;
