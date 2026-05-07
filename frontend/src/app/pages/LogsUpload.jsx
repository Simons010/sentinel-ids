import { FileUploadArea } from "../components/FileUploadArea";
import { UploadedFilesList } from "../components/UploadedFilesList";
import { AIAnalysisControls } from "../components/AIAnalysisControls";
import { LogsPreviewTable } from "../components/LogsPreviewTable";
import { UploadHistoryTable } from "../components/UploadHistoryTable";
import { DataValidationPanel } from "../components/DataValidationPanel";
import { LogsUploadHistorySectionSkeleton } from "../components/PageLoadingSkeletons";
import { useLogUpload } from "../hooks/useLogUpload";

export default function LogsUpload() {
  const {
    uploadedFiles,
    selectedFile,
    isProcessing,
    validationData,
    previewLogs,
    uploadHistory,
    historyLoading,
    handleFilesSelected,
    handleRemoveFile,
    handleAnalyze,
    handleViewHistoryLogs,
    handleReanalyzeFromHistory,
    handleDeleteHistoryItem,
  } = useLogUpload();

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
      {selectedFile && (
        <AIAnalysisControls
          selectedFile={selectedFile}
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
      {historyLoading ? (
        <LogsUploadHistorySectionSkeleton />
      ) : (
        <UploadHistoryTable
          history={uploadHistory}
          onViewLogs={handleViewHistoryLogs}
          onReanalyze={handleReanalyzeFromHistory}
          onDelete={handleDeleteHistoryItem}
          actionsDisabled={isProcessing}
        />
      )}

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
