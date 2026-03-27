import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

export function RecentAlertsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const alerts = [
    {
      id: "ALT-2026-4872",
      timestamp: "2026-02-11 14:23:18",
      sourceIp: "185.220.101.54",
      destination: "10.0.45.128:443",
      threatType: "SQL Injection",
      severity: "Critical",
      confidence: 0.97,
      status: "Active",
    },
    {
      id: "ALT-2026-4871",
      timestamp: "2026-02-11 14:21:05",
      sourceIp: "198.50.133.21",
      destination: "10.0.12.89:80",
      threatType: "DDoS Attack",
      severity: "High",
      confidence: 0.94,
      status: "Active",
    },
    {
      id: "ALT-2026-4870",
      timestamp: "2026-02-11 14:18:42",
      sourceIp: "45.148.10.83",
      destination: "10.0.32.156:22",
      threatType: "Brute Force",
      severity: "Critical",
      confidence: 0.98,
      status: "Resolved",
    },
    {
      id: "ALT-2026-4869",
      timestamp: "2026-02-11 14:15:29",
      sourceIp: "91.215.85.13",
      destination: "10.0.78.201:8080",
      threatType: "XSS Attack",
      severity: "Medium",
      confidence: 0.85,
      status: "Active",
    },
    {
      id: "ALT-2026-4868",
      timestamp: "2026-02-11 14:12:11",
      sourceIp: "103.253.145.29",
      destination: "10.0.15.67:443",
      threatType: "Malware Upload",
      severity: "High",
      confidence: 0.91,
      status: "Resolved",
    },
    {
      id: "ALT-2026-4867",
      timestamp: "2026-02-11 14:09:58",
      sourceIp: "172.98.45.210",
      destination: "10.0.23.94:3306",
      threatType: "Port Scanning",
      severity: "Low",
      confidence: 0.78,
      status: "Active",
    },
  ];

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.threatType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-[#EF4444] text-white";
      case "High":
        return "bg-[#F97316] text-white";
      case "Medium":
        return "bg-[#F59E0B] text-white";
      case "Low":
        return "bg-[#10B981] text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30"
      : "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30";
  };

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts by id, type, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-74 bg-[#0F172A] border border-[#334155] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
          {/* Filter Button
          <button className="flex items-center gap-2 px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white hover:border-[#22D3EE] transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Alert ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Timestamp
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Source IP
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Destination
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Threat Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Severity
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Confidence
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-b border-[#334155]/50 hover:bg-[#0F172A]/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-mono text-[#22D3EE]">
                  {alert.id}
                </td>
                <td className="py-3 px-4 text-sm text-gray-300">
                  {alert.timestamp}
                </td>
                <td className="py-3 px-4 text-sm font-mono text-white">
                  {alert.sourceIp}
                </td>
                <td className="py-3 px-4 text-sm font-mono text-gray-300">
                  {alert.destination}
                </td>
                <td className="py-3 px-4 text-sm text-white">
                  {alert.threatType}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(alert.severity)}`}
                  >
                    {alert.severity}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22D3EE] rounded-full"
                        style={{ width: `${alert.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-white">
                      {(alert.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(alert.status)}`}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="p-2 hover:bg-[#22D3EE]/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-[#22D3EE]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">Showing 6 of 247 alerts</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-[#0F172A] border border-[#334155] rounded text-sm text-white hover:border-[#22D3EE] transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-[#22D3EE] rounded text-sm text-white">
            1
          </button>
          <button className="px-3 py-1 bg-[#0F172A] border border-[#334155] rounded text-sm text-white hover:border-[#22D3EE] transition-colors">
            2
          </button>
          <button className="px-3 py-1 bg-[#0F172A] border border-[#334155] rounded text-sm text-white hover:border-[#22D3EE] transition-colors">
            3
          </button>
          <button className="px-3 py-1 bg-[#0F172A] border border-[#334155] rounded text-sm text-white hover:border-[#22D3EE] transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
