import { Calendar, FileDown } from "lucide-react";
import { useState } from "react";

export function ReportGeneratorPanel({
  onGenerateReport,
  isGenerating = false,
}) {
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-03-06");
  const [reportType, setReportType] = useState("threat-summary");
  const [reportFormat, setReportFormat] = useState("pdf");

  const reportTypes = [
    { value: "threat-summary", label: "Threat Summary Report" },
    { value: "log-activity", label: "Log Activity Report" },
    { value: "network-security", label: "Network Security Report" },
    { value: "ai-detection", label: "AI Detection Performance Report" },
  ];

  const reportFormats = [
    { value: "pdf", label: "PDF" },
    { value: "csv", label: "CSV" },
    { value: "json", label: "JSON" },
  ];

  const handleGenerate = () => {
    if (onGenerateReport) {
      onGenerateReport({
        startDate,
        endDate,
        reportType,
        reportFormat,
      });
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-lg flex items-center justify-center">
          <FileDown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Report Generator</h3>
          <p className="text-sm text-gray-400">
            Configure and generate security reports
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
        </div>

        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Report Format */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Report Format
          </label>
          <select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
          >
            {reportFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`w-fit bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all flex items-center justify-center gap-2 
          ${
            isGenerating
              ? "bg-gray-600 cursor-not-allowed hover:shadow-none"
              : "bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] hover:shadow-lg hover:shadow-[#22D3EE]/30"
          }`}
      >
        <FileDown className="w-5 h-5" />
        {isGenerating ? "Generating Report..." : "Generate Report"}
      </button>
    </div>
  );
}
