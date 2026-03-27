import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function AttackTypeDistribution() {
  const data = [
    { name: 'Brute Force', value: 342, color: '#EF4444' },
    { name: 'SQL Injection', value: 289, color: '#F97316' },
    { name: 'XSS', value: 167, color: '#F59E0B' },
    { name: 'DDoS', value: 124, color: '#22D3EE' },
    { name: 'Port Scanning', value: 98, color: '#10B981' }
  ];

  const renderCustomLabel = (entry) => {
    return `${entry.percent > 0.05 ? (entry.percent * 100).toFixed(0) + '%' : ''}`;
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Attack Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
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
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
