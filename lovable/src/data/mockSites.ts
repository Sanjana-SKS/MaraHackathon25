
import { Site } from '@/types/site';

export const mockSites: Site[] = [
  {
    id: 1,
    name: 'Texas Solar Farm Alpha',
    lat: 31.9686,
    lng: -99.9018,
    state: 'Texas',
    profitPerWatt: 0.0234,
    carbonIntensity: 0.45,
    powerCapacity: 150,
    powerUsed: 87,
    status: 'optimal',
    energyPrice: 0.04,
    revenue: 12500,
    curtailmentRisk: 'low',
    weather: { windSpeed: 12, solarIrradiance: 850, temp: 85, cloudCover: 20 },
    inference: {
        asic: {
            max_machines: 10,
            power: 15000,
            tokens: 500
        },
        gpu: {
            max_machines: 10,
            power: 5000,
            tokens: 1000
        }
    },
    miners: {
        air: {
            max_machines: 10,
            hashrate: 1000,
            power: 3500
        },
        hydro: {
            max_machines: 10,
            hashrate: 5000,
            power: 5000
        },
        immersion: {
            max_machines: 10,
            hashrate: 10000,
            power: 10000
        }
    },
    power: 1000000,
    site_id: 1,
    updated_at: "2025-06-21T13:17:50.126193"
  },
  {
    name: 'California Hybrid Hub',
    lat: 38.8026,
    lng: -116.4194,
    state: 'Nevada',
    profitPerWatt: 0.0198,
    carbonIntensity: 0.62,
    powerCapacity: 200,
    powerUsed: 165,
    status: 'high-load',
    energyPrice: 0.06,
    revenue: 18200,
    curtailmentRisk: 'medium',
    weather: { windSpeed: 8, solarIrradiance: 920, temp: 92, cloudCover: 5 },
    inference: {
        asic: {
            max_machines: 10,
            power: 15000,
            tokens: 500
        },
        gpu: {
            max_machines: 10,
            power: 5000,
            tokens: 1000
        }
    },
    miners: {
        air: {
            max_machines: 10,
            hashrate: 1000,
            power: 3500
        },
        hydro: {
            max_machines: 10,
            hashrate: 5000,
            power: 5000
        },
        immersion: {
            max_machines: 10,
            hashrate: 10000,
            power: 10000
        }
    },
    power: 1000000,
    id: 2,
    site_id: 2,
    updated_at: "2025-06-21T13:17:50.126193"
  },
  {
    id: 3,
    name: 'Montana Wind Grid',
    lat: 47.0527,
    lng: -109.6333,
    state: 'Montana',
    profitPerWatt: 0.0289,
    carbonIntensity: 0.23,
    powerCapacity: 95,
    powerUsed: 45,
    status: 'optimal',
    energyPrice: 0.03,
    revenue: 8900,
    curtailmentRisk: 'low',
    weather: { windSpeed: 18, solarIrradiance: 780, temp: 68, cloudCover: 35 },
    inference: {
        asic: {
            max_machines: 10,
            power: 15000,
            tokens: 500
        },
        gpu: {
            max_machines: 10,
            power: 5000,
            tokens: 1000
        }
    },
    miners: {
        air: {
            max_machines: 10,
            hashrate: 1000,
            power: 3500
        },
        hydro: {
            max_machines: 10,
            hashrate: 5000,
            power: 5000
        },
        immersion: {
            max_machines: 10,
            hashrate: 10000,
            power: 10000
        }
    },
    power: 1000000,
    site_id: 3,
    updated_at: "2025-06-21T13:17:50.126193"
  },
  {
    id: 4,
    name: 'California Hybrid Hub',
    lat: 36.7783,
    lng: -119.4179,
    state: 'California',
    profitPerWatt: 0.0156,
    carbonIntensity: 0.38,
    powerCapacity: 180,
    powerUsed: 134,
    status: 'warning',
    energyPrice: 0.08,
    revenue: 15600,
    curtailmentRisk: 'high',
    weather: { windSpeed: 6, solarIrradiance: 800, temp: 88, cloudCover: 15 },
    inference: {
        asic: {
            max_machines: 10,
            power: 15000,
            tokens: 500
        },
        gpu: {
            max_machines: 10,
            power: 5000,
            tokens: 1000
        }
    },
    miners: {
        air: {
            max_machines: 10,
            hashrate: 1000,
            power: 3500
        },
        hydro: {
            max_machines: 10,
            hashrate: 5000,
            power: 5000
        },
        immersion: {
            max_machines: 10,
            hashrate: 10000,
            power: 10000
        }
    },
    power: 1000000,
    site_id: 4,
    updated_at: "2025-06-21T13:17:50.126193"
  },
  {
    id: 5,
    name: 'Wyoming Coal-to-Crypto',
    lat: 43.0759,
    lng: -107.2903,
    state: 'Wyoming',
    profitPerWatt: 0.0267,
    carbonIntensity: 0.78,
    powerCapacity: 220,
    powerUsed: 198,
    status: 'high-carbon',
    energyPrice: 0.035,
    revenue: 22100,
    curtailmentRisk: 'medium',
    weather: { windSpeed: 14, solarIrradiance: 690, temp: 75, cloudCover: 45 },
    inference: {
        asic: {
            max_machines: 10,
            power: 15000,
            tokens: 500
        },
        gpu: {
            max_machines: 10,
            power: 5000,
            tokens: 1000
        }
    },
    miners: {
        air: {
            max_machines: 10,
            hashrate: 1000,
            power: 3500
        },
        hydro: {
            max_machines: 10,
            hashrate: 5000,
            power: 5000
        },
        immersion: {
            max_machines: 10,
            hashrate: 10000,
            power: 10000
        }
    },
    power: 1000000,
    site_id: 5,
    updated_at: "2025-06-21T13:17:50.126193"
  }
];
