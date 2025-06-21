
import { Site, ComputeData, MinerData } from '@/types/site';

export const projectToSVG = (lat: number, lng: number) => {
  // Simple Mercator-like projection for US bounds
  const x = ((lng + 125) / 58) * 800; // Rough US longitude range
  const y = ((50 - lat) / 25) * 500; // Rough US latitude range
  return { x, y };
};

export const getStatusColor = (site: Site) => {
  switch (site.status) {
    case 'optimal': return '#A9F43A'; // lime
    case 'high-load': return '#FFC300'; // golden
    case 'warning': return '#FF6B35'; // warning-orange
    case 'high-carbon': return '#FF0000'; // red
    default: return '#FFC300';
  }
};

export const generateComputeData = (site: Site): ComputeData => {
  // Generate realistic compute allocation based on site characteristics
  const baseASIC = Math.floor(40 + Math.random() * 30);
  const baseGPU = Math.floor(20 + Math.random() * 25);
  const baseImmersion = Math.floor(5 + Math.random() * 15);
  
  return {
    asic: baseASIC,
    gpu: baseGPU,
    immersion: baseImmersion,
    total: baseASIC + baseGPU + baseImmersion
  };
};

export const generateMinerTypes = (): MinerData => {
  return {
    'Antminer S19': Math.floor(15 + Math.random() * 20),
    'Antminer S19 Pro': Math.floor(10 + Math.random() * 15),
    'Whatsminer M30S': Math.floor(8 + Math.random() * 12),
    'Avalon 1246': Math.floor(5 + Math.random() * 10),
    'RTX 4090': Math.floor(12 + Math.random() * 18),
    'RTX 3080': Math.floor(8 + Math.random() * 15)
  };
};
