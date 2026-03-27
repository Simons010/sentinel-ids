import { GeographicalAttackMap } from '../components/GeographicalAttackMap';
import { AttackHeatmap } from '../components/AttackHeatmap';
import { LiveActivityTicker } from '../components/LiveActivityTicker';
import { TopAttackSourcesChart } from '../components/TopAttackSourcesChart';
import { StatCard } from '../components/StatCard';
import { Globe, MapPin, Activity, TrendingUp } from 'lucide-react';

export default function Network() {
  const networkStatCards = [
    {
      icon: Globe,
      title: 'Countries Monitored',
      value: '142',
      change: 2.1,
      sparklineData: [138, 139, 139, 140, 140, 141, 141, 142, 142, 142, 142, 142],
      accentColor: '#22D3EE'
    },
    {
      icon: MapPin,
      title: 'Attack Origins',
      value: '58',
      change: -12.3,
      sparklineData: [68, 66, 65, 64, 62, 61, 60, 59, 58, 58, 58, 58],
      accentColor: '#EF4444'
    },
    {
      icon: Activity,
      title: 'Network Events',
      value: '12.4K',
      change: 15.8,
      sparklineData: [10.2, 10.5, 10.8, 11.0, 11.3, 11.6, 11.8, 12.0, 12.2, 12.3, 12.4, 12.4],
      accentColor: '#F59E0B'
    },
    {
      icon: TrendingUp,
      title: 'Traffic Analyzed',
      value: '8.7GB',
      change: 8.9,
      sparklineData: [7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.7, 8.7],
      accentColor: '#10B981'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Network Monitor</h1>
        <p className="text-gray-400">Global threat visualization and network activity tracking</p>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {networkStatCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Live Activity Ticker */}
      <LiveActivityTicker />

      {/* Geographical Attack Map */}
      <GeographicalAttackMap />

      {/* Attack Heatmap */}
      <AttackHeatmap />

      {/* Top Attack Sources */}
      <TopAttackSourcesChart />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Network scan updated: 5 seconds ago</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              Network monitoring active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
