import { Calendar } from "lucide-react";

const getHeatColor = (intensity, max) => {
  if (!max || max === 0) return "#0F172A";
  const pct = intensity / max;
  if (pct < 0.2) return "#0F172A";
  if (pct < 0.4) return "#10B981";
  if (pct < 0.6) return "#F59E0B";
  if (pct < 0.8) return "#F97316";
  return "#EF4444";
};

export function AttackHeatmap({ heatmap = [], summary = {} }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Find max value for relative color scaling
  const allValues = heatmap.flatMap((row) => row.hours);
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Attack Intensity Heatmap
          </h3>
        </div>
        <div className="text-sm text-gray-400">Last 7 Days</div>
      </div>

      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-gray-400">Low</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
            <div
              key={v}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getHeatColor(v * maxVal, maxVal) }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">High</span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex mb-2">
            <div className="w-12" />
            {hours.map((h) => (
              <div key={h} className="flex-1 min-w-[28px] text-center">
                {h % 3 === 0 && (
                  <span className="text-xs text-gray-400">
                    {h.toString().padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {heatmap.map((row, dayIndex) => (
            <div key={dayIndex} className="flex items-center mb-1">
              <div className="w-12 text-xs text-gray-400 text-right pr-2">
                {row.day}
              </div>
              <div className="flex gap-1 flex-1">
                {row.hours.map((count, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="flex-1 min-w-[28px] h-7 rounded hover:ring-2 hover:ring-[#22D3EE] transition-all cursor-pointer group relative"
                    style={{ backgroundColor: getHeatColor(count, maxVal) }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-lg">
                        <div className="font-semibold">
                          {row.day} {hourIndex}:00
                        </div>
                        <div className="text-gray-400">{count} attacks</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#334155]">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#EF4444]">
            {summary.peak_hour_attacks ?? 0}
          </p>
          <p className="text-xs text-gray-400">Peak Hour Attacks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#F59E0B]">
            {summary.total_weekly ?? 0}
          </p>
          <p className="text-xs text-gray-400">Total Weekly Attacks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#22D3EE]">
            {summary.most_active_hour ?? "--"}
          </p>
          <p className="text-xs text-gray-400">Most Active Time</p>
        </div>
      </div>
    </div>
  );
}
