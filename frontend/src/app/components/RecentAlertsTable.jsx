import { useState } from "react";
import { Search, Eye } from "lucide-react";

export function RecentAlertsTable({
  alerts = [],
  totalAlerts = 0,
  page,
  setPage,
  search,
  setSearch,
}) {
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(totalAlerts / PAGE_SIZE);
  const currentPage = Number(page) || 1;

  // Map backend field names to display fields
  const mapped = alerts.map((a) => ({
    id: `ALT-${a.id}`,
    timestamp: a.log_details?.timestamp ?? a.created_at,
    sourceIp: a.log_details?.src_ip ?? "—",
    destination: a.log_details?.dst_ip
      ? `${a.log_details.dst_ip}:${a.log_details.dst_port ?? ""}`
      : "—",
    threatType: a.attack_type,
    severity: a.severity?.charAt(0).toUpperCase() + a.severity?.slice(1),
    confidence: a.log_details?.ml_score ?? 0,
    status: a.log_details?.is_suspicious ? "Active" : "Resolved",
  }));

  const getSeverityColor = (s) =>
    ({
      Critical: "bg-red-700 text-white uppercase",
      High: "bg-[#F97316] text-white",
      Medium: "bg-[#F59E0B] text-white",
      Low: "bg-[#10B981] text-white",
      Informational: "bg-gray-500 text-white",
    })[s] ?? "bg-gray-500 text-white";

  const getStatusColor = (s) =>
    s === "Active"
      ? "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30"
      : "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30";

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts by id, type, status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-74 bg-[#0F172A] border border-[#334155] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              {[
                "Alert ID",
                "Timestamp",
                "Source IP",
                "Destination",
                "Threat Type",
                "Severity",
                "Confidence",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapped.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  No alerts found
                </td>
              </tr>
            ) : (
              mapped.map((alert) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">
          Showing {mapped.length} of {totalAlerts} alerts
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#0F172A] border border-[#334155] rounded text-sm text-white hover:border-[#22D3EE] transition-colors disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === p
                  ? "bg-[#22D3EE] text-white"
                  : "bg-[#0F172A] border border-[#334155] text-white hover:border-[#22D3EE]"
              } transition-colors`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-[#0F172A] border border-[#334155] rounded text-sm text-white hover:border-[#22D3EE] transition-colors disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
