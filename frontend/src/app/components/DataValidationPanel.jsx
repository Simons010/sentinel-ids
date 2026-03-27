import { FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function DataValidationPanel({ validationData }) {
  const metrics = [
    {
      icon: FileText,
      label: "Total Logs Detected",
      value: validationData?.totalLogs || 0,
      color: "#22D3EE",
    },
    {
      icon: CheckCircle,
      label: "Valid Logs Parsed",
      value: validationData?.validLogs || 0,
      color: "#10B981",
    },
    {
      icon: XCircle,
      label: "Invalid Entries",
      value: validationData?.invalidLogs || 0,
      color: "#EF4444",
    },
    {
      icon: AlertTriangle,
      label: "Parsing Errors",
      value: validationData?.parsingErrors || 0,
      color: "#F59E0B",
    },
  ];

  const totalLogs = validationData?.totalLogs || 0;
  const validLogs = validationData?.validLogs || 0;
  const validPercentage =
    totalLogs > 0 ? ((validLogs / totalLogs) * 100).toFixed(1) : 0;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Data Validation</h3>
      <p className="text-sm text-gray-400 mb-6">
        Validation results for uploaded log files
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 hover:border-[#22D3EE]/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: metric.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {metric.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* Validation Progress Bar */}
      <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">
            Validation Success Rate
          </span>
          <span className="text-sm font-bold text-[#10B981]">
            {validPercentage}%
          </span>
        </div>
        <div className="w-full bg-[#334155] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#10B981] to-[#22D3EE] h-2 rounded-full transition-all duration-500"
            style={{ width: `${validPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
