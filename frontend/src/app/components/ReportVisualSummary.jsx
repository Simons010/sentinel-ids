import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ReportVisualSummary() {
  const threatDistribution = [
    { name: 'SQL Injection', value: 342, color: '#EF4444' },
    { name: 'DDoS', value: 289, color: '#F97316' },
    { name: 'Brute Force', value: 234, color: '#F59E0B' },
    { name: 'XSS', value: 189, color: '#22D3EE' },
    { name: 'Other', value: 189, color: '#8B5CF6' }
  ];

  const logActivity = [
    { time: 'Week 1', logs: 645000 },
    { time: 'Week 2', logs: 712000 },
    { time: 'Week 3', logs: 698000 },
    { time: 'Week 4', logs: 735000 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Threat Distribution */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Threat Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={threatDistribution}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {threatDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Log Activity */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Log Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={logActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => value.toLocaleString()}
            />
            <Bar dataKey="logs" fill="#22D3EE" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
