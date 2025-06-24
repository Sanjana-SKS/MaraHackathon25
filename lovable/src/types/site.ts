
export interface Site {
  id: number;
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
  inference: {
    asic: {
      max_machines: number;
      power: number;
      tokens: number;
    };
    gpu: {
      max_machines: number;
      power: number;
      tokens: number;
    };
  };
  miners: {
    air: {
      max_machines: number;
      hashrate: number;
      power: number;
    }; 
    hydro: {
      max_machines: number;
      hashrate: number;
      power: number;
    };
    immersion: {
      max_machines: number;
      hashrate: number;
      power: number;
    };
  };
  power: number;
  site_id: number;
  updated_at: string;
}

export interface ComputeData {
  asic: number;
  gpu: number;
  immersion: number;
  total: number;
}

export interface MinerData {
  [key: string]: number;
}
