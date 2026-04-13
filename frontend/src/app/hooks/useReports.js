import { useState, useEffect } from "react";
import { generateReport, getReports } from "../../api/reports";
import { toast } from "sonner";

export function useReports() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getReports();
      setHistory(res);
    } catch (e) {
      console.error("Failed to fetch report history", e);
      toast.error("Failed to load report history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGenerateReport = async (config) => {
    setIsGenerating(true);
    try {
      const payload = {
        start_date: config.startDate,
        end_date: config.endDate,
        // convert frontend values to backend expected values
        report_type: config.reportType.replace(/-/g, "_"),
        format: config.reportFormat,
      };

      const result = await generateReport(payload);
      setPreviewData(result);
      toast.success("Report generated successfully!", {
        description: `${config.reportType} in ${config.reportFormat.toUpperCase()} format.`,
      });
      fetchHistory(); // Refresh history to include the new report
    } catch (e) {
      console.error("Failed to generate report", e);
      toast.error(
        `Failed to generate report: ${e.friendlyMessage ?? e.message}`,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    history,
    historyLoading,
    previewData,
    isGenerating,
    handleGenerateReport,
  };
}
