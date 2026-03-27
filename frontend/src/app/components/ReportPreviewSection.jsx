import { FileText, Shield, AlertTriangle, Target, Globe, TrendingUp } from 'lucide-react';

export function ReportPreviewSection() {
  const previewMetrics = [
    {
      icon: FileText,
      label: 'Total Logs Processed',
      value: '2,847,392',
      color: '#22D3EE'
    },
    {
      icon: Shield,
      label: 'Total Threats Detected',
      value: '1,243',
      color: '#F59E0B'
    },
    {
      icon: AlertTriangle,
      label: 'Critical Threats',
      value: '87',
      color: '#EF4444'
    },
    {
      icon: Target,
      label: 'Most Common Attack',
      value: 'SQL Injection',
      color: '#F97316'
    },
    {
      icon: Globe,
      label: 'Top Attacking IP',
      value: '192.168.45.67',
      color: '#8B5CF6'
    },
    {
      icon: TrendingUp,
      label: 'Detection Accuracy',
      value: '98.2%',
      color: '#10B981'
    }
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Report Preview</h3>
      <p className="text-sm text-gray-400 mb-6">Summary of key metrics from the generated report</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 hover:border-[#22D3EE] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                  <p className="text-lg font-bold text-white">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
