import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'; 
 
const data = [
  { time: '00:00', normal: 4200, suspicious: 120, threats: 8 },
  { time: '02:00', normal: 3800, suspicious: 98, threats: 5 },
  { time: '04:00', normal: 3200, suspicious: 85, threats: 3 },
  { time: '06:00', normal: 5100, suspicious: 145, threats: 12 },
  { time: '08:00', normal: 8900, suspicious: 320, threats: 28 },
  { time: '10:00', normal: 12400, suspicious: 450, threats: 35 },
  { time: '12:00', normal: 13800, suspicious: 520, threats: 42 },
  { time: '14:00', normal: 14200, suspicious: 480, threats: 38 },
  { time: '16:00', normal: 13100, suspicious: 510, threats: 45 },
  { time: '18:00', normal: 10800, suspicious: 380, threats: 32 },
  { time: '20:00', normal: 8200, suspicious: 280, threats: 22 },
  { time: '22:00', normal: 6100, suspicious: 190, threats: 15 },
];

export function ThreatDetectionTimeline() {
  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Threat Detection Over Time</h3>
        <div className="text-sm text-gray-400">Last 24 Hours</div>
      </div>
      
      <div className="h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748B"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#fff' }}
              iconType="line"
            />
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
              dot={{ r: 4, fill: '#EF4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}