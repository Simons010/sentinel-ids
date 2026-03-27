import { Calendar } from 'lucide-react';

const generateHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data = [];

  for (let day = 0; day < 7; day++) {
    const dayData = [];
    for (let hour = 0; hour < 24; hour++) {
      // Simulate attack patterns - higher during business hours and specific times
      let intensity = Math.random() * 30;
      
      // Peak attack times simulation
      if (hour >= 9 && hour <= 17) intensity += Math.random() * 40;
      if (hour >= 22 || hour <= 2) intensity += Math.random() * 50;
      if (day >= 0 && day <= 4) intensity += Math.random() * 20; // Weekdays
      
      dayData.push(Math.min(100, intensity));
    }
    data.push(dayData);
  }
  
  return { days, hours, data };
};

const getHeatColor = (intensity) => {
  if (intensity < 20) return '#0F172A';
  if (intensity < 40) return '#10B981';
  if (intensity < 60) return '#F59E0B';
  if (intensity < 80) return '#F97316';
  return '#EF4444';
};

export function AttackHeatmap() {
  const { days, hours, data } = generateHeatmapData();

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Attack Intensity Heatmap</h3>
        </div>
        <div className="text-sm text-gray-400">Last 7 Days</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-gray-400">Low</span>
        <div className="flex gap-1">
          {[20, 40, 60, 80, 100].map((val) => (
            <div
              key={val}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getHeatColor(val) }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">High</span>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12" /> {/* Space for day labels */}
            {hours.map((hour) => (
              <div key={hour} className="flex-1 min-w-[28px] text-center">
                {hour % 3 === 0 && (
                  <span className="text-xs text-gray-400">{hour.toString().padStart(2, '0')}</span>
                )}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {data.map((dayData, dayIndex) => (
            <div key={dayIndex} className="flex items-center mb-1">
              <div className="w-12 text-xs text-gray-400 text-right pr-2">
                {days[dayIndex]}
              </div>
              <div className="flex gap-1 flex-1">
                {dayData.map((intensity, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="flex-1 min-w-[28px] h-7 rounded hover:ring-2 hover:ring-[#22D3EE] transition-all cursor-pointer group relative"
                    style={{ backgroundColor: getHeatColor(intensity) }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-lg">
                        <div className="font-semibold">{days[dayIndex]} {hourIndex}:00</div>
                        <div className="text-gray-400">Intensity: {intensity.toFixed(0)}%</div>
                        <div className="text-gray-400">~{Math.floor(intensity * 10)} attacks</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#334155]">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#EF4444]">1,247</p>
          <p className="text-xs text-gray-400">Peak Hour Attacks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#F59E0B]">8,934</p>
          <p className="text-xs text-gray-400">Total Weekly Attacks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#22D3EE]">14:00</p>
          <p className="text-xs text-gray-400">Most Active Time</p>
        </div>
      </div>
    </div>
  );
}
