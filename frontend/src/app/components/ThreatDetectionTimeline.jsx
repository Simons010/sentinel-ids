import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function ThreatDetectionTimeline({ data }) {
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Threat Detection Over Time
        </h3>
        <div className="text-sm text-gray-400">Last 24 Hours</div>
      </div>

      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#64748B" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend wrapperStyle={{ color: "#fff" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="normal"
              stroke="#10B981"
              strokeWidth={2}
              name="Normal Traffic"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="suspicious"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Suspicious Activity"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="threats"
              stroke="#EF4444"
              strokeWidth={2}
              name="Confirmed Threats"
              dot={{ r: 4, fill: "#EF4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
