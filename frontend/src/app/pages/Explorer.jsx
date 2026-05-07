import { useState } from "react";
import { useExplorer } from "../hooks/useExplorer";
import { RecentAlertsTable } from "../components/RecentAlertsTable";
import { EventDetailsDialog } from "../components/EventDetailsDialog";
import {
  Search,
  Eye,
  Shield,
  Activity,
  Filter,
  RefreshCcw,
} from "lucide-react";

export default function Explorer() {
  const {
    logs,
    totalLogs,
    logPage,
    setLogPage,
    logSearch,
    setLogSearch,
    alerts,
    totalAlerts,
    alertPage,
    setAlertPage,
    alertSearch,
    setAlertSearch,
    loading,
    error,
    refetchLogs,
    refetchAlerts,
  } = useExplorer();

  const [activeTab, setActiveTab] = useState("logs");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (event) => {
    // If it's a log, normalize it for the dialog
    const normalized = event.attack_type
      ? {
          // It's already an alert (from RecentAlertsTable)
          ...event,
        }
      : {
          // It's a raw log
          severity: event.is_suspicious ? "high" : "informational",
          timestamp: event.timestamp,
          attack_type: event.is_suspicious
            ? "Suspicious Activity"
            : "Normal Traffic",
          text: event.message || "Network event captured",
          src_ip: event.src_ip,
          dst_ip: event.dst_ip,
          host: event.host,
          process: event.process,
          pid: event.pid,
          confidence:
            event.ai_score > 0 ? event.ai_score : (event.ml_score ?? 0),
          message: event.message,
          raw_log: event.raw_log, // Include raw log
        };
    setSelectedEvent(normalized);
    setIsDialogOpen(true);
  };

  const handleLogDetails = (log) => {
    handleViewDetails(log);
  };

  const LOG_PAGE_SIZE = 10;
  const totalLogPages = Math.ceil(totalLogs / LOG_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Explorer</h1>
          <p className="text-gray-400">
            Unified view for all system logs and security alerts
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              activeTab === "logs" ? refetchLogs() : refetchAlerts()
            }
            className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white hover:border-[#22D3EE] transition-colors"
          >
            <RefreshCcw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#0F172A] rounded-xl border border-[#334155] w-fit">
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "logs"
              ? "bg-[#22D3EE] text-white shadow-lg shadow-[#22D3EE]/20"
              : "text-gray-400 hover:text-white hover:bg-[#1E293B]"
          }`}
        >
          <Activity className="w-4 h-4" />
          Network Logs
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "logs" ? "bg-white/20" : "bg-[#334155]"}`}
          >
            {totalLogs}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "alerts"
              ? "bg-[#22D3EE] text-white shadow-lg shadow-[#22D3EE]/20"
              : "text-gray-400 hover:text-white hover:bg-[#1E293B]"
          }`}
        >
          <Shield className="w-4 h-4" />
          Security Alerts
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "alerts" ? "bg-white/20" : "bg-[#334155]"}`}
          >
            {totalAlerts}
          </span>
        </button>
      </div>

      {activeTab === "logs" ? (
        <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-white">
                All Network Logs
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0F172A] rounded-full border border-[#334155]">
                <div className="w-2 h-2 bg-[#22D3EE] rounded-full" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Raw Ingest
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter logs by IP, protocol, message..."
                  value={logSearch}
                  onChange={(e) => {
                    setLogSearch(e.target.value);
                    setLogPage(1);
                  }}
                  className="w-80 bg-[#0F172A] border border-[#334155] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#334155]">
                  {[
                    "Timestamp",
                    "Source",
                    "Destination",
                    "Protocol",
                    "Status",
                    "Confidence",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/30">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Activity className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">
                        No logs found matching your criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-[#0F172A]/50 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-sm text-gray-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-mono text-white">
                            {log.src_ip}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {log.host || "unknown-host"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-mono text-white">
                            {log.dst_ip}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Port: {log.dst_port}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#334155] text-[10px] font-bold text-white uppercase tracking-wider">
                          {log.protocol}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.is_suspicious
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                          }`}
                        >
                          {log.is_suspicious ? "Suspicious" : "Clean"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 w-24">
                          <div className="flex-1 h-1 bg-[#0F172A] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#22D3EE] rounded-full"
                              style={{
                                width: `${(log.ai_score || log.ml_score || 0) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {(
                              (log.ai_score || log.ml_score || 0) * 100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleLogDetails(log)}
                          className="p-1.5 hover:bg-[#22D3EE]/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-[#22D3EE]" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#334155]/50">
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="text-white font-medium">{logs.length}</span> of{" "}
              <span className="text-white font-medium">{totalLogs}</span>{" "}
              entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                disabled={logPage === 1}
                className="px-4 py-1.5 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white hover:border-[#22D3EE] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-1.5 text-sm text-gray-400 border border-[#334155] rounded-lg bg-[#0F172A]">
                Page {logPage} of {totalLogPages || 1}
              </span>
              <button
                onClick={() =>
                  setLogPage((p) => Math.min(totalLogPages, p + 1))
                }
                disabled={logPage >= totalLogPages || totalLogPages === 0}
                className="px-4 py-1.5 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white hover:border-[#22D3EE] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <RecentAlertsTable
          alerts={alerts}
          totalAlerts={totalAlerts}
          page={alertPage}
          setPage={setAlertPage}
          search={alertSearch}
          setSearch={setAlertSearch}
          onViewDetails={handleViewDetails}
        />
      )}

      <EventDetailsDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
