import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Critical", value: 12, color: "#EF4444" },
  { name: "High", value: 28, color: "#F97316" },
  { name: "Medium", value: 45, color: "#F59E0B" },
  { name: "Low", value: 89, color: "#10B981" },
  { name: "Informational", value: 156, color: "#22D3EE" },
];

export function AlertsChart() {
  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Alerts by Severity
      </h3>

      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
