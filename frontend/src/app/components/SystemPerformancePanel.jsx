import { Cpu, HardDrive, Activity, Zap, Database } from 'lucide-react';

function Metric({ icon: Icon, label, value, percentage, color }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
      <div className="relative h-2 bg-[#0F172A] rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

export function SystemPerformancePanel() {
  const metrics = [
    { icon: Cpu, label: 'CPU Usage', value: '42%', percentage: 42, color: '#10B981' },
    { icon: Activity, label: 'Memory Usage', value: '68%', percentage: 68, color: '#F59E0B' },
    { icon: HardDrive, label: 'Disk Usage', value: '55%', percentage: 55, color: '#22D3EE' },
    { icon: Zap, label: 'API Response Time', value: '23ms', percentage: 15, color: '#10B981' },
    { icon: Database, label: 'Log Ingestion Rate', value: '8,420/s', percentage: 84, color: '#22D3EE' },
  ];

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
      
      {metrics.map((metric) => (
        <Metric key={metric.label} {...metric} />
      ))}

      {/* System Health Badge */}
      <div className="mt-6 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Overall Health</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-[#10B981]">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
