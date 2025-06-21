
export interface Site {
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

export interface ComputeData {
  asic: number;
  gpu: number;
  immersion: number;
  total: number;
}

export interface MinerData {
  [key: string]: number;
}
