import { Eye, RotateCw, Trash2, FileText } from "lucide-react";

export function UploadHistoryTable() {
  const uploadHistory = [
    {
      id: 1,
      fileName: "server-logs-2026-03-05.csv",
      uploadDate: "Mar 5, 2026 14:23",
      totalLogs: 45823,
      status: "Completed",
      analysisResult: "Threats: 24 • Clean: 45799",
      threats: 24,
    },
    {
      id: 2,
      fileName: "network-traffic-week9.json",
      uploadDate: "Mar 4, 2026 09:15",
      totalLogs: 89456,
      status: "Completed",
      analysisResult: "Threats: 67 • Clean: 89389",
      threats: 67,
    },
    {
      id: 3,
      fileName: "firewall-logs-daily.txt",
      uploadDate: "Mar 3, 2026 16:45",
      totalLogs: 34567,
      status: "Completed",
      analysisResult: "Threats: 12 • Clean: 34555",
      threats: 12,
    },
    {
      id: 4,
      fileName: "access-logs-2026-03-02.log",
      uploadDate: "Mar 2, 2026 11:30",
      totalLogs: 52341,
      status: "Processing",
      analysisResult: "In Progress...",
      threats: null,
    },
    {
      id: 5,
      fileName: "web-server-logs-feb.csv",
      uploadDate: "Feb 28, 2026 08:00",
      totalLogs: 123456,
      status: "Completed",
      analysisResult: "Threats: 156 • Clean: 123300",
      threats: 156,
    },
    {
      id: 6,
      fileName: "vpn-connections.json",
      uploadDate: "Feb 25, 2026 13:20",
      status: "Failed",
      totalLogs: 0,
      analysisResult: "Parse Error",
      threats: null,
    },
  ];

  const getStatusBadge = (status) => {
    const statusColors = {
      Completed: "bg-[#10B981]/20 text-[#10B981]",
      Processing: "bg-[#F59E0B]/20 text-[#F59E0B]",
      Failed: "bg-[#EF4444]/20 text-[#EF4444]",
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Upload History</h3>
          <p className="text-sm text-gray-400 mt-1">
            Previously uploaded and analyzed files
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                File Name
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Upload Date
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Total Logs
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Analysis Result
              </th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {uploadHistory.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#0F172A] transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#22D3EE]" />
                    <span className="text-sm font-medium text-white">
                      {item.fileName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-300">
                  {item.uploadDate}
                </td>
                <td className="py-4 px-4 text-sm text-gray-300">
                  {item.totalLogs > 0 ? item.totalLogs.toLocaleString() : "—"}
                </td>
                <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`text-sm ${
                      item.threats !== null && item.threats > 0
                        ? "text-[#EF4444] font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    {item.analysisResult}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-2 hover:bg-[#22D3EE]/10 rounded transition-colors group"
                      title="View logs"
                    >
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#22D3EE]" />
                    </button>
                    {item.status === "Completed" && (
                      <button
                        className="p-2 hover:bg-[#10B981]/10 rounded transition-colors group"
                        title="Reanalyze"
                      >
                        <RotateCw className="w-4 h-4 text-gray-400 group-hover:text-[#10B981]" />
                      </button>
                    )}
                    <button
                      className="p-2 hover:bg-[#EF4444]/10 rounded transition-colors group"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-[#EF4444]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
