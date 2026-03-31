import { useDashboardStats } from "../hooks/useDashboardStats";
import { useLiveFeed } from "../hooks/useLiveFeed";
import { StatCard } from "../components/StatCard";
import { ThreatLevelIndicator } from "../components/ThreatLevelIndicator";
import { AlertsChart } from "../components/AlertsChart";
import { ThreatDetectionTimeline } from "../components/ThreatDetectionTimeline";
import { TopAttackSourcesChart } from "../components/TopAttackSourcesChart";
import { AIAnalysisPanel } from "../components/AIAnalysisPanel";
import { SystemPerformancePanel } from "../components/SystemPerformancePanel";
import {
  FileText,
  AlertTriangle,
  Shield,
  Activity,
  Target,
  Heart,
} from "lucide-react";

export default function Dashboard() {
  const { data, loading, error } = useDashboardStats();
  const { events, connected } = useLiveFeed();

  // Mock data for stat cards
  const statCardsData = data
    ? [
        {
          icon: FileText,
          title: "Total Logs Processed Today",
          value: data.total_logs_24h?.toLocaleString() ?? "--",
          change: 12.5,
          sparklineData: [45, 52, 48, 58, 65, 72, 68, 75, 82, 88, 95, 92],
          accentColor: "#22D3EE",
        },
        {
          icon: AlertTriangle,
          title: "Active Alerts",
          value: data.active_alerts?.toString() ?? "--",
          change: -8.2,
          sparklineData: [
            280, 275, 268, 260, 255, 252, 248, 247, 246, 247, 248, 247,
          ],
          accentColor: "#EF4444",
        },
        {
          icon: Shield,
          title: "Critical Threats",
          value: data.critical_threats?.toString() ?? "--",
          change: -15.3,
          sparklineData: [18, 17, 16, 15, 14, 14, 13, 13, 12, 12, 12, 12],
          accentColor: "#F97316",
        },
        {
          icon: Activity,
          title: "Anomaly Detection Rate",
          value: `${data.anomaly_detection_rate ?? "--"}%`,
          change: 2.1,
          sparklineData: [
            3.8, 3.9, 4.0, 4.1, 4.0, 4.1, 4.2, 4.3, 4.2, 4.2, 4.1, 4.2,
          ],
          accentColor: "#F59E0B",
        },
        {
          icon: Target,
          title: "Model Accuracy",
          value: `${data.model_accuracy ?? "--"}%`,
          change: 0.3,
          sparklineData: [
            95.8, 96.0, 96.2, 96.3, 96.4, 96.5, 96.6, 96.7, 96.8, 96.8, 96.9,
            96.8,
          ],
          accentColor: "#10B981",
        },
        {
          icon: Heart,
          title: "System Health Score",
          value: "98/100",
          change: 1.0,
          sparklineData: [96, 96, 97, 97, 98, 98, 98, 97, 98, 98, 98, 98],
          accentColor: "#10B981",
        },
      ]
    : [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Security Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time threat monitoring and AI-powered analysis
        </p>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCardsData.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div>
        <span className="text-white">
          {connected ? "Live" : "Reconnecting..."}
        </span>
        {events.map((event) => (
          <div key={event.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
            <p className="text-gray-400">{event.description}</p>
          </div>
        ))}
      </div>

      {/* Threat Level & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ThreatLevelIndicator
          threatScore={73}
          level="High"
          lastUpdated="2 mins ago"
        />
        <AlertsChart />
        <SystemPerformancePanel />
      </div>

      {/* Log Activity Chart */}
      <ThreatDetectionTimeline />

      {/* Attack Sources & AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAttackSourcesChart />
        <AIAnalysisPanel />
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Last system sync: 30 seconds ago</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
