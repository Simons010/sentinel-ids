import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  Critical: "#EF4444",
  High: "#F97316",
  Medium: "#F59E0B",
  Low: "#10B981",
  Informational: "#22D3EE",
};

export function AlertsChart({ data }) {
  const chartData = data
    ? Object.entries(data).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[name.charAt(0).toUpperCase() + name.slice(1)] ?? "#888",
      }))
    : Object.entries(COLORS).map(([name]) => ({
        name,
        value: 0,
        color: COLORS[name],
      }));

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Alerts by Severity
      </h3>

      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
              formatter={(value, entry) => (
                <span style={{ color: "#fff" }}>
                  {value}: {entry.payload.value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
