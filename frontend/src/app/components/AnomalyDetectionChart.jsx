import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function AnomalyDetectionChart({
  normalCount = 0,
  anomalousCount = 0,
  anomalyRate = 0,
}) {
  const data = [
    { name: "Normal Logs", value: normalCount, color: "#10B981" },
    { name: "Anomalous Logs", value: anomalousCount, color: "#EF4444" },
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Anomaly Detection Insights
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-[#334155] flex items-center justify-between text-sm">
        <span className="text-gray-400">Anomaly Rate</span>
        <span className="text-[#EF4444] font-semibold">{anomalyRate}%</span>
      </div>
    </div>
  );
}
