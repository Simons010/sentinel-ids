import { LineChart, Line, ResponsiveContainer } from "recharts";

export function StatCard({
  icon: Icon,
  title,
  value,
  change,
  sparklineData = [], //default to empty array if not provided
  accentColor = "#22D3EE",
}) {
  const isPositive = change >= 0;
  const chartData = sparklineData.map((value, index) => ({ value, index }));

  return (
    <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155] hover:border-[#22D3EE]/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center`}
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-medium ${
            isPositive
              ? "bg-[#10B981]/20 text-[#10B981]"
              : "bg-[#EF4444]/20 text-[#EF4444]"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>

      {/* Sparkline */}
      <div className="h-12 min-h-[48px] -mx-1">
        <ResponsiveContainer width="100%" height={48}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={accentColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
