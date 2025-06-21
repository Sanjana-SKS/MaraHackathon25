
import React from 'react';
import { ComputeData, MinerData } from '@/types/site';

interface MapChartsProps {
  computeData: ComputeData;
  minerData: MinerData;
}

export const createDonutChartSVG = (data: ComputeData) => {
  const { asic, gpu, immersion, total } = data;
  
  return `
    <svg width="80" height="80" viewBox="0 0 80 80" style="margin: 8px auto; display: block;">
      <circle cx="40" cy="40" r="30" fill="none" stroke="#A9F43A" stroke-width="8" 
              stroke-dasharray="${(asic/total) * 188.5} 188.5" transform="rotate(-90 40 40)"/>
      <circle cx="40" cy="40" r="30" fill="none" stroke="#FFC300" stroke-width="8" 
              stroke-dasharray="${(gpu/total) * 188.5} 188.5" 
              stroke-dashoffset="-${(asic/total) * 188.5}" transform="rotate(-90 40 40)"/>
      <circle cx="40" cy="40" r="30" fill="none" stroke="#00D9FF" stroke-width="8" 
              stroke-dasharray="${(immersion/total) * 188.5} 188.5" 
              stroke-dashoffset="-${((asic + gpu)/total) * 188.5}" transform="rotate(-90 40 40)"/>
      <text x="40" y="44" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${total}</text>
    </svg>
  `;
};

export const createBarChartSVG = (data: MinerData) => {
  const maxValue = Math.max(...Object.values(data).map(val => Number(val)));
  let bars = '';
  let y = 10;
  
  Object.entries(data).forEach(([name, value]) => {
    const numValue = Number(value);
    const width = (numValue / maxValue) * 120;
    bars += `
      <rect x="10" y="${y}" width="${width}" height="12" fill="#A9F43A" opacity="0.8"/>
      <text x="15" y="${y + 9}" fill="white" font-size="8">${name.split(' ')[0]} (${numValue})</text>
    `;
    y += 18;
  });
  
  return `<svg width="160" height="${y + 10}" viewBox="0 0 160 ${y + 10}">${bars}</svg>`;
};

const MapCharts: React.FC<MapChartsProps> = ({ computeData, minerData }) => {
  return (
    <>
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-2">Compute Mix</div>
        <div dangerouslySetInnerHTML={{ __html: createDonutChartSVG(computeData) }} />
        <div className="flex justify-center gap-3 text-xs mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-lime rounded-full"></div>
            <span>ASIC</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-golden rounded-full"></div>
            <span>GPU</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-energy-blue rounded-full"></div>
            <span>Immersion</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-3">
        <div className="text-xs text-muted-foreground mb-2">Active Miners</div>
        <div dangerouslySetInnerHTML={{ __html: createBarChartSVG(minerData) }} />
      </div>
    </>
  );
};

export default MapCharts;
