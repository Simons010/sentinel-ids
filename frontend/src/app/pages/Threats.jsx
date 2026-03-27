import { RecentAlertsTable } from '../components/RecentAlertsTable';
import { AIAnalysisPanel } from '../components/AIAnalysisPanel';
import { AlertsChart } from '../components/AlertsChart';
import { ThreatLevelIndicator } from '../components/ThreatLevelIndicator';
import { StatCard } from '../components/StatCard';
import { AlertTriangle, Shield, Target, AlertCircle } from 'lucide-react';
import  TopThreatVectors from '../components/TopThreatVectors';

export default function Threats() {
  const threatStatCards = [
    {
      icon: AlertTriangle,
      title: 'Active Threats',
      value: '247',
      change: -8.2,
      sparklineData: [280, 275, 268, 260, 255, 252, 248, 247, 246, 247, 248, 247],
      accentColor: '#EF4444'
    },
    {
      icon: Shield,
      title: 'Critical Threats',
      value: '12',
      change: -15.3,
      sparklineData: [18, 17, 16, 15, 14, 14, 13, 13, 12, 12, 12, 12],
      accentColor: '#F97316'
    },
    {
      icon: AlertCircle,
      title: 'Medium Priority',
      value: '89',
      change: 5.4,
      sparklineData: [82, 84, 85, 86, 87, 88, 87, 88, 89, 88, 89, 89],
      accentColor: '#F59E0B'
    },
    {
      icon: Target,
      title: 'Blocked Attacks',
      value: '1,432',
      change: 18.7,
      sparklineData: [1200, 1250, 1280, 1320, 1350, 1380, 1400, 1420, 1410, 1425, 1430, 1432],
      accentColor: '#10B981'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence</h1>
        <p className="text-gray-400">Comprehensive threat analysis and alert management</p>
      </div>

      {/* Threat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {threatStatCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Threat Level & Alerts Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ThreatLevelIndicator 
          threatScore={73}
          level="High"
          lastUpdated="2 mins ago"
        />
        <AlertsChart />

        <TopThreatVectors />
      </div>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel />

      {/* Recent Alerts Table */}
      <RecentAlertsTable />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Last threat update: 15 seconds ago</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              Threat detection active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
