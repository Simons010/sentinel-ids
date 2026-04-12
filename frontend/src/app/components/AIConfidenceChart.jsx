import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AIConfidenceChart({ data = [], averageConfidence = 0 }) {
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        AI Confidence Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="range" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar dataKey="count" fill="#22D3EE" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-[#334155] flex items-center justify-between text-sm">
        <span className="text-gray-400">Avg Confidence</span>
        <span className="text-[#22D3EE] font-semibold">
          {averageConfidence}%
        </span>
      </div>
    </div>
  );
}
