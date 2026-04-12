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

export function TopAttackSourcesChart({ data = [] }) {
  const mapped = data.map((s) => ({
    ip: s.log__src_ip ?? "unknown",
    threats: s.count,
    score: Math.min(99, (s.max_score ?? 1) * 25),
  }));

  const maxThreats = mapped[0]?.threats || 1;

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Top Attack Sources
      </h3>

      <div className="space-y-4">
        {mapped.map((item) => (
          <div key={item.ip} className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-[#22D3EE]">
                    {item.ip}
                  </span>
                  <span className="text-xs text-gray-400">
                    Risk: {item.score}%
                  </span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {item.threats} threats
                </span>
              </div>
              <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-full"
                  style={{ width: `${(item.threats / maxThreats) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {mapped.length === 0 && (
          <p className="text-gray-400 text-sm">
            No attack sources recorded yet
          </p>
        )}
      </div>

      {mapped.length > 0 && (
        <div className="h-64 min-h-[256px] mt-6">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={mapped} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                stroke="#64748B"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                type="category"
                dataKey="ip"
                stroke="#64748B"
                style={{ fontSize: "11px" }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="threats" radius={[0, 8, 8, 0]}>
                {mapped.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#EF4444" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
