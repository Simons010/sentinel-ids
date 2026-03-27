import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

export function LogsPreviewTable({ logs }) {
  const getThreatBadge = (threat) => {
    if (!threat || threat === "None") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-[#10B981]/20 text-[#10B981]">
          <CheckCircle className="w-3 h-3" />
          Clean
        </span>
      );
    }

    const severityColors = {
      Critical: "bg-[#EF4444]/20 text-[#EF4444]",
      High: "bg-[#F97316]/20 text-[#F97316]",
      Medium: "bg-[#F59E0B]/20 text-[#F59E0B]",
      Low: "bg-[#10B981]/20 text-[#10B981]",
    };

    const severity = threat.severity || "Medium";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${severityColors[severity]}`}
      >
        <AlertTriangle className="w-3 h-3" />
        {threat.type || threat}
      </span>
    );
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Log Preview</h3>
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No logs available for preview</p>
          <p className="text-sm text-gray-500 mt-1">
            Upload a file to see log entries
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Log Preview</h3>
          <p className="text-sm text-gray-400 mt-1">
            Sample entries from uploaded logs
          </p>
        </div>
        <span className="text-xs text-gray-400">
          Showing {logs.length} of {logs.length} entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Timestamp
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Source IP
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Destination IP
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Protocol
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Request Type
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Detected Threat
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-[#0F172A] transition-colors">
                <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                  {log.timestamp}
                </td>
                <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                  {log.sourceIp}
                </td>
                <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                  {log.destIp}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-300 font-medium">
                    {log.protocol}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-300">
                  {log.requestType}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-sm font-medium ${
                      log.status >= 200 && log.status < 300
                        ? "text-[#10B981]"
                        : log.status >= 400
                          ? "text-[#EF4444]"
                          : "text-gray-300"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-4">{getThreatBadge(log.threat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
