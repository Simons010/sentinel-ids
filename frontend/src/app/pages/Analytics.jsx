import { useAnalytics } from "../hooks/useAnalytics";
import { StatCard } from "../components/StatCard";
import { ThreatDetectionTimeline } from "../components/ThreatDetectionTimeline";
import { ConfusionMatrix } from "../components/ConfusionMatrix";
import { AttackTypeDistribution } from "../components/AttackTypeDistribution";
import { AnomalyDetectionChart } from "../components/AnomalyDetectionChart";
import { AIConfidenceChart } from "../components/AIConfidenceChart";
import { ModelInfoPanel } from "../components/ModelInfoPanel";
import { Target, TrendingUp, Activity, Award } from "lucide-react";

export default function Analytics() {
  const { data, loading, error } = useAnalytics();

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );

  if (loading)
    return (
      <div className="space-y-6">
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
        <div className="h-80 bg-gray-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );

  // Model Performance Metrics
  const modelMetrics = [
    {
      icon: Target,
      title: "Accuracy",
      value: `${data?.accuracy}%`,
      change: 2.1,
      sparklineData: [
        95,
        95.5,
        96,
        96.8,
        97.2,
        97.6,
        97.9,
        98,
        98.1,
        98.2,
        data?.accuracy,
      ],
      accentColor: "#10B981",
    },
    {
      icon: TrendingUp,
      title: "Precision",
      value: `${data?.precision}%`,
      change: 1.8,
      sparklineData: [
        94,
        94.5,
        95,
        95.5,
        96,
        96.2,
        96.4,
        96.5,
        96.6,
        96.7,
        data?.precision,
      ],
      accentColor: "#22D3EE",
    },
    {
      icon: Activity,
      title: "Recall",
      value: `${data?.recall}%`,
      change: 2.3,
      sparklineData: [
        93,
        94,
        95,
        95.5,
        96,
        96.5,
        97,
        97.2,
        97.3,
        97.4,
        data?.recall,
      ],
      accentColor: "#F59E0B",
    },
    {
      icon: Award,
      title: "F1 Score",
      value: `${data?.f1_score}%`,
      change: 2.0,
      sparklineData: [
        93.5,
        94,
        94.8,
        95.3,
        95.8,
        96.2,
        96.5,
        96.7,
        96.9,
        97.0,
        data?.f1_score,
      ],
      accentColor: "#EF4444",
    },
  ];

  // Calculate avg confidence from distribution
  const avgConfidence =
    data?.confidence_distribution?.length > 0
      ? Math.round(
          data.confidence_distribution.reduce(
            (sum, b, i) => sum + b.count * (i * 20 + 10),
            0,
          ) /
            (data.confidence_distribution.reduce(
              (sum, b) => sum + b.count,
              0,
            ) || 1),
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400">
          Machine learning insights and detection statistics
        </p>
      </div>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Threat Detection Over Time */}
      <ThreatDetectionTimeline data={data.hourly_threat_data} />

      {/* Confusion Matrix and Attack Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfusionMatrix data={data.confusion_matrix} />
        <AttackTypeDistribution data={data.attack_type_distribution} />
      </div>

      {/* Anomaly Detection and AI Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyDetectionChart
          normalCount={data.normal_count}
          anomalousCount={data.anomalous_count}
          anomalyRate={data.anomaly_rate}
        />
        <AIConfidenceChart
          data={data.confidence_distribution}
          avgConfidence={avgConfidence}
        />
      </div>

      {/* Model Information Panel */}
      <ModelInfoPanel data={data.model_info} />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Analytics updated: 1 minute ago</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              Model active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
