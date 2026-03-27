import { ReportGeneratorPanel } from "../components/ReportGeneratorPanel";
import { ReportPreviewSection } from "../components/ReportPreviewSection";
import { ReportsHistoryTable } from "../components/ReportsHistoryTable";
import { ReportVisualSummary } from "../components/ReportVisualSummary";
import { useState } from "react";
import { toast } from "sonner";

export default function Reports() {
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = (reportConfig) => {
    // Simulate report generation
    setShowPreview(true);
    toast.success("Report generated successfully!", {
      description: `${reportConfig.reportType} in ${reportConfig.reportFormat.toUpperCase()} format`,
    });
  };

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
      <ReportGeneratorPanel onGenerateReport={handleGenerateReport} />

      {/* Report Preview (shown after generation) */}
      {showPreview && (
        <>
          <ReportPreviewSection />
          <ReportVisualSummary />
        </>
      )}

      {/* Reports History */}
      <ReportsHistoryTable />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Last report generated: 5 minutes ago</span>
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
