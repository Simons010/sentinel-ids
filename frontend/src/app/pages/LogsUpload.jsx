import { FileUploadArea } from "../components/FileUploadArea";
import { UploadedFilesList } from "../components/UploadedFilesList";
import { AIAnalysisControls } from "../components/AIAnalysisControls";
import { LogsPreviewTable } from "../components/LogsPreviewTable";
import { UploadHistoryTable } from "../components/UploadHistoryTable";
import { DataValidationPanel } from "../components/DataValidationPanel";
import { useState } from "react";
import { toast } from "sonner";

export default function LogsUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileForAnalysis, setSelectedFileForAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewLogs, setPreviewLogs] = useState([]);
  const [validationData, setValidationData] = useState(null);

  const handleFilesSelected = (files) => {
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      timestamp: new Date().toLocaleString(),
      status: "uploading",
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      simulateUpload(file.id, index);
    });

    toast.success(`${files.length} file(s) added to upload queue`);
  };

  const simulateUpload = (fileId, delay) => {
    let progress = 0;
    const interval = setInterval(
      () => {
        progress += 10;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress,
                  status: progress >= 100 ? "ready" : "uploading",
                }
              : f,
          ),
        );

        if (progress >= 100) {
          clearInterval(interval);
          // Set first uploaded file as selected for analysis
          setUploadedFiles((prev) => {
            const readyFile = prev.find((f) => f.id === fileId);
            if (readyFile && !selectedFileForAnalysis) {
              setSelectedFileForAnalysis(readyFile.name);
              generateMockPreviewData();
              generateMockValidationData();
            }
            return prev;
          });
          toast.success("File uploaded successfully and ready for analysis");
        }
      },
      200 + delay * 100,
    );
  };

  const generateMockPreviewData = () => {
    const mockLogs = [
      {
        timestamp: "2026-03-06 10:23:45",
        sourceIp: "192.168.1.45",
        destIp: "10.0.0.12",
        protocol: "HTTP",
        requestType: "GET",
        status: 200,
        threat: "None",
      },
      {
        timestamp: "2026-03-06 10:24:12",
        sourceIp: "203.45.67.89",
        destIp: "10.0.0.12",
        protocol: "HTTP",
        requestType: "POST",
        status: 403,
        threat: { type: "SQL Injection", severity: "Critical" },
      },
      {
        timestamp: "2026-03-06 10:24:45",
        sourceIp: "192.168.1.67",
        destIp: "10.0.0.12",
        protocol: "HTTPS",
        requestType: "GET",
        status: 200,
        threat: "None",
      },
      {
        timestamp: "2026-03-06 10:25:18",
        sourceIp: "185.23.45.67",
        destIp: "10.0.0.12",
        protocol: "HTTP",
        requestType: "POST",
        status: 401,
        threat: { type: "Brute Force", severity: "High" },
      },
      {
        timestamp: "2026-03-06 10:26:03",
        sourceIp: "192.168.1.89",
        destIp: "10.0.0.12",
        protocol: "HTTP",
        requestType: "GET",
        status: 200,
        threat: "None",
      },
      {
        timestamp: "2026-03-06 10:26:34",
        sourceIp: "198.12.34.56",
        destIp: "10.0.0.12",
        protocol: "HTTP",
        requestType: "POST",
        status: 500,
        threat: { type: "XSS", severity: "Medium" },
      },
      {
        timestamp: "2026-03-06 10:27:12",
        sourceIp: "192.168.1.23",
        destIp: "10.0.0.12",
        protocol: "HTTPS",
        requestType: "GET",
        status: 200,
        threat: "None",
      },
      {
        timestamp: "2026-03-06 10:27:45",
        sourceIp: "172.16.45.89",
        destIp: "10.0.0.12",
        protocol: "HTTP",
        requestType: "PUT",
        status: 404,
        threat: "None",
      },
    ];

    setPreviewLogs(mockLogs);
  };

  const generateMockValidationData = () => {
    setValidationData({
      totalLogs: 8542,
      validLogs: 8398,
      invalidLogs: 112,
      parsingErrors: 32,
    });
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.info("File removed from queue");
  };

  const handleAnalyze = () => {
    if (!selectedFileForAnalysis) {
      toast.error("Please select a file to analyze");
      return;
    }

    setIsProcessing(true);
    toast.info("Starting AI analysis...");

    // Update file status to processing
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.name === selectedFileForAnalysis
          ? { ...f, status: "processing", progress: 0 }
          : f,
      ),
    );

    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === selectedFileForAnalysis ? { ...f, progress } : f,
        ),
      );

      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === selectedFileForAnalysis
              ? { ...f, status: "completed", progress: 100 }
              : f,
          ),
        );
        setIsProcessing(false);
        toast.success("Analysis completed! Threats detected: 3", {
          description: "Check the log preview for detailed results",
        });
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Logs Upload</h1>
        <p className="text-gray-400">
          Upload system or network log files and analyze them using the
          Sentinel-IDS AI detection engine.
        </p>
      </div>

      {/* File Upload Area */}
      <FileUploadArea onFilesSelected={handleFilesSelected} />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <UploadedFilesList
          files={uploadedFiles}
          onRemoveFile={handleRemoveFile}
        />
      )}

      {/* AI Analysis Controls */}
      {selectedFileForAnalysis && (
        <AIAnalysisControls
          selectedFile={selectedFileForAnalysis}
          onAnalyze={handleAnalyze}
          isProcessing={isProcessing}
        />
      )}

      {/* Data Validation Panel */}
      {validationData && (
        <DataValidationPanel validationData={validationData} />
      )}

      {/* Logs Preview */}
      {previewLogs.length > 0 && <LogsPreviewTable logs={previewLogs} />}

      {/* Upload History */}
      <UploadHistoryTable />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>AI Engine Status: Active</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              Ready to analyze
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
