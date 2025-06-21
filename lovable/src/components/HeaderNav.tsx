
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, MapPin, BarChart3, Cpu, TrendingUp, Shield, Zap } from 'lucide-react';

interface HeaderNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ activeTab = 'map', onTabChange }) => {
  const navItems = [
    { key: 'map', label: 'Map', icon: MapPin },
    { key: 'sites', label: 'Sites', icon: BarChart3 },
    { key: 'api', label: 'API Explorer', icon: Cpu },
    { key: 'forecast', label: 'Forecast Models', icon: TrendingUp },
    { key: 'admin', label: 'Admin', icon: Shield }
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-golden to-lime rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold glow-text text-golden">Green Hash</h1>
            <p className="text-xs text-muted-foreground font-mono">MARA Compute Orchestration</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <Button 
              key={key}
              variant="ghost" 
              size="sm" 
              className={`${
                activeTab === key 
                  ? 'text-black bg-golden hover:bg-golden/80' 
                  : 'text-golden hover:text-black hover:bg-golden/80'
              }`}
              onClick={() => onTabChange?.(key)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-lime rounded-full"></Badge>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border"></div>
          <div className="text-sm font-mono">
            <div className="text-golden font-semibold">Live</div>
            <div className="text-xs text-muted-foreground">09:14:23</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
