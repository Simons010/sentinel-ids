import { useThreats } from "../hooks/useThreats";
import { RecentAlertsTable } from "../components/RecentAlertsTable";
import { AIAnalysisPanel } from "../components/AIAnalysisPanel";
import { AlertsChart } from "../components/AlertsChart";
import { ThreatLevelIndicator } from "../components/ThreatLevelIndicator";
import { StatCard } from "../components/StatCard";
import TopThreatVectors from "../components/TopThreatVectors";
import { AlertTriangle, Shield, Target, AlertCircle } from "lucide-react";

export default function Threats() {
  const {
    stats,
    alerts,
    totalAlerts,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
  } = useThreats();

  const threatStatCards = stats
    ? [
        {
          icon: AlertTriangle,
          title: "Active Threats",
          value: stats.active_threats?.toString() ?? "--",
          change: -8.2,
          sparklineData: [
            280, 275, 268, 260, 255, 252, 248, 247, 246, 247, 248, 247,
          ],
          accentColor: "#EF4444",
        },
        {
          icon: Shield,
          title: "Critical Threats",
          value: stats.critical_threats?.toString() ?? "--",
          change: -15.3,
          sparklineData: [18, 17, 16, 15, 14, 14, 13, 13, 12, 12, 12, 12],
          accentColor: "#F97316",
        },
        {
          icon: AlertCircle,
          title: "Medium Priority",
          value: stats.medium_priority?.toString() ?? "--",
          change: 5.4,
          sparklineData: [82, 84, 85, 86, 87, 88, 87, 88, 89, 88, 89, 89],
          accentColor: "#F59E0B",
        },
        {
          icon: Target,
          title: "Blocked Attacks",
          value: stats.blocked_attacks?.toLocaleString() ?? "--",
          change: 18.7,
          sparklineData: [
            1200, 1250, 1280, 1320, 1350, 1380, 1400, 1420, 1410, 1425, 1430,
            1432,
          ],
          accentColor: "#10B981",
        },
      ]
    : [];

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );

  // Prevent any child component accessing data before it arrives
  if (loading)
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Threat Intelligence
          </h1>
          <p className="text-gray-400">
            Comprehensive threat analysis and alert management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
        </div>
        <div className="h-10 bg-gray-800 rounded animate-pulse" />
        <div className="h-96 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Threat Intelligence
        </h1>
        <p className="text-gray-400">
          Comprehensive threat analysis and alert management
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-800 rounded-lg animate-pulse"
                />
              ))
          : threatStatCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
      </div>

      {/* Threat Level, Alerts Chart, Top Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ThreatLevelIndicator
          threatScore={stats?.threat_level ?? 0}
          level={
            (stats?.threat_level ?? 0) >= 75
              ? "Critical"
              : (stats?.threat_level ?? 0) >= 50
                ? "High"
                : "Medium"
          }
          lastUpdated="Just now"
        />
        <AlertsChart data={stats?.severity_breakdown} />
        <TopThreatVectors data={stats?.top_threat_vectors} />
      </div>

      <AIAnalysisPanel data={stats?.ai_summary} />

      <RecentAlertsTable
        alerts={alerts}
        totalAlerts={totalAlerts}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />

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
