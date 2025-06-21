
import React from 'react';
import { Card } from '@/components/ui/card';

interface AdminDashboardProps {
  totalSites: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ totalSites }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-golden mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="metric-card p-4">
          <h3 className="font-semibold mb-2">System Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lime rounded-full"></div>
            <span className="text-sm">All systems operational</span>
          </div>
        </Card>
        <Card className="metric-card p-4">
          <h3 className="font-semibold mb-2">Active Alerts</h3>
          <p className="text-2xl font-bold text-golden">3</p>
          <p className="text-sm text-muted-foreground">Curtailment warnings</p>
        </Card>
        <Card className="metric-card p-4">
          <h3 className="font-semibold mb-2">Total Sites</h3>
          <p className="text-2xl font-bold text-lime">{totalSites}</p>
          <p className="text-sm text-muted-foreground">Active locations</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
