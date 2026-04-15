import { useState } from "react";
import { Eye, RotateCw, Trash2, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function UploadHistoryTable({
  history = [],
  onViewLogs,
  onReanalyze,
  onDelete,
  actionsDisabled = false,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-[#10B981]/20 text-[#10B981]",
      processing: "bg-[#F59E0B]/20 text-[#F59E0B]",
      failed: "bg-[#EF4444]/20 text-[#EF4444]",
      pending: "bg-[#22D3EE]/20 text-[#22D3EE]",
    };
    const statusLabel = {
      completed: "Completed",
      processing: "In Progress",
      failed: "Failed",
      pending: "Pending",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[status] ?? statusColors.pending}`}
      >
        {statusLabel[status] ?? statusLabel.pending}
      </span>
    );
  };

  const formatResult = (item) => {
    if (item.status === "failed") return "Analysis failed";
    if (item.status === "processing") return "In Progress...";
    if (item.status === "pending") return "Awaiting AI analysis";
    if ((item.threats_found ?? 0) === 0 && (item.clean_logs ?? 0) === 0) {
      return "Awaiting AI analysis";
    }
    if (item.threats_found > 0)
      return `Threats: ${item.threats_found} • Clean: ${item.clean_logs}`;
    return `Clean: ${item.clean_logs ?? item.total_logs}`;
  };

  return (
    <>
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Upload History</h3>
          <p className="text-sm text-gray-400 mt-1">
            Previously uploaded and analyzed files
          </p>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto"
        style={{
          scrollbarWidth: "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.scrollbarWidth = "thin";
          e.currentTarget.style.scrollbarColor = "#334155 #1E293B";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.scrollbarWidth = "none";
        }}>
        <table className="w-full h-full" >
          <thead>
            <tr className="border-b border-[#334155]">
              {[
                "File Name",
                "Upload Date",
                "Total Logs",
                "Analysis Status",
                "Analysis Result",
                "Actions",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`text-${i === 5 ? "right" : "left"} text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="divide-y divide-[#334155] "
          >
     
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  No upload history yet
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#0F172A] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#22D3EE]" />
                      <span className="text-sm font-medium text-white">
                        {item.filename}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-300">
                    {new Date(item.uploaded_at).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-300">
                    {item.total_logs > 0
                      ? item.total_logs.toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${item.threats_found > 0 ? "text-[#EF4444] font-medium" : "text-gray-300"}`}
                      >
                        {formatResult(item)}
                      </span>
                      {item.status === "pending" && item.queue_position ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#22D3EE]/20 text-[#22D3EE]">
                          Queue #{item.queue_position}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewLogs?.(item)}
                        disabled={actionsDisabled}
                        className="p-2 hover:bg-[#22D3EE]/10 rounded transition-colors group"
                        title="View logs"
                      >
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#22D3EE]" />
                      </button>
                      {item.status !== "processing" && (
                        <button
                          onClick={() => onReanalyze?.(item)}
                          disabled={actionsDisabled}
                          className="p-2 hover:bg-[#10B981]/10 rounded transition-colors group"
                          title="Reanalyze"
                        >
                          <RotateCw className="w-4 h-4 text-gray-400 group-hover:text-[#10B981]" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(item)}
                        disabled={actionsDisabled}
                        className="p-2 hover:bg-[#EF4444]/10 rounded transition-colors group"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="bg-[#1E293B] border border-[#334155] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Upload History Entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {deleteTarget
                ? `This will permanently delete "${deleteTarget.filename}" from upload history.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#0F172A] border-[#334155] text-white hover:bg-[#334155]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  onDelete?.(deleteTarget);
                }
                setDeleteTarget(null);
              }}
              className="bg-[#EF4444] text-white hover:bg-[#DC2626]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
