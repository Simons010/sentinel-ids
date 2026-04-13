import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#EF4444", "#F97316", "#F59E0B", "#22D3EE", "#8B5CF6"];

export function ReportVisualSummary({ data }) {
  const threatDistribution =
    data?.threat_distribution?.length > 0
      ? data.threat_distribution.map((d) => ({
          name: d.attack_type,
          value: d.count,
        }))
      : [];

  const weeklyActivity =
    data?.weekly_activity?.length > 0 ? data.weekly_activity : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Threat Distribution */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Threat Distribution
        </h3>
        {threatDistribution.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No threat data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={threatDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                }
                labelLine={false}
              >
                {threatDistribution.map((_, index) => (
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
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Weekly Log Activity */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Weekly Log Activity
        </h3>
        {weeklyActivity.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No log activity for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(v) => v.toLocaleString()}
              />
              <Bar dataKey="logs" fill="#22D3EE" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
