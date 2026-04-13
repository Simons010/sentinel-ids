import { ReportGeneratorPanel } from "../components/ReportGeneratorPanel";
import { ReportPreviewSection } from "../components/ReportPreviewSection";
import { ReportsHistoryTable } from "../components/ReportsHistoryTable";
import { ReportVisualSummary } from "../components/ReportVisualSummary";
import { useReports } from "../hooks/useReports";

export default function Reports() {
  const {
    history,
    historyLoading,
    previewData,
    isGenerating,
    handleGenerateReport,
    handleDownloadReport,
  } = useReports();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Security Reports</h1>
        <p className="text-gray-400">
          Generate and download comprehensive security reports
        </p>
      </div>

      {/* Report Generator */}
      <ReportGeneratorPanel
        onGenerateReport={handleGenerateReport}
        isGenerating={isGenerating}
      />

      {/* Report Preview (only shown after generation) */}
      {previewData && (
        <>
          <ReportPreviewSection data={previewData} />
          <ReportVisualSummary data={previewData} />
        </>
      )}

      {/* Reports History */}
      <ReportsHistoryTable
        history={history}
        loading={historyLoading}
        onDownload={handleDownloadReport}
      />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>
              {history.length > 0
                ? `Last report: ${new Date(history[0]?.generated_at).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                : "No reports generated yet"}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              Report service active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
