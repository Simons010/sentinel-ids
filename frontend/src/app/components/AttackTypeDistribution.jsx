import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#22D3EE",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
];

export function AttackTypeDistribution({ data = [] }) {
  const chartData =
    data.length > 0
      ? data.map((d) => ({
          name: d.attack_type,
          value: d.count,
        }))
      : [];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Attack Type Distribution
      </h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No attack data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={(entry) =>
                entry.percent > 0.05
                  ? `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
                  : ""
              }
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#9CA3AF" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
