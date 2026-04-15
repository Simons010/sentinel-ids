import { useState, useEffect } from "react";
import {
  uploadFile,
  getUploadHistory,
  deleteUpload,
  getUploadPreview,
  analyzeUploadFile,
  markUploadAnalysisFailed,
} from "../../api/logs";
import { toast } from "sonner";

export function useLogUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [previewLogs, setPreviewLogs] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load upload history on mount
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(() => {
      fetchHistory(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async (showLoading = true) => {
    if (showLoading) {
      setHistoryLoading(true);
    }
    try {
      const res = await getUploadHistory();
      setUploadHistory(res);
    } catch (e) {
      console.error("Failed to load upload history:", e);
    } finally {
      if (showLoading) {
        setHistoryLoading(false);
      }
    }
  };

  const handleFilesSelected = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = `temp-${Date.now()}-${i}`; // temporary ID for tracking before backend response

      // Add file to list immediately with uploading status
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: tempId,
          name: file.name,
          size: file.size,
          timestamp: new Date().toLocaleString(),
          status: "uploading",
          progress: 0,
        },
      ]);

      try {
        // Upload with progress tracking
        const result = await uploadFile(file, (percent) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === tempId ? { ...f, progress: percent } : f,
            ),
          );
        });

        // update with backend response
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === tempId
              ? {
                  ...f,
                  id: result.id,
                  status:
                    result.status === "failed"
                      ? "failed"
                      : result.status === "processing"
                        ? "processing"
                        : "ready",
                  progress: 100,
                }
              : f,
          ),
        );

        if (!result?.id) {
          toast.error(
            `Upload succeeded but no upload id was returned for ${file.name}.`,
          );
          continue;
        }

        // Always select latest successful upload and reflect validation stats.
        setSelectedFile({ name: file.name, backendId: result.id });
        setValidationData({
          totalLogs: result.total_logs ?? 0,
          validLogs: result.valid_logs ?? 0,
          invalidLogs: result.invalid_logs ?? 0,
          parsingErrors: result.parse_errors ?? 0,
        });
        await buildPreviewLogs(result.id);

        toast.success(
          `${file.name} uploaded. Click "Analyze with AI" to run detection.`,
        );
        await fetchHistory();
      } catch (e) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === tempId ? { ...f, status: "failed", progress: 0 } : f,
          ),
        );
        toast.error(
          `Failed to upload ${file.name}: ${e.friendlyMessage ?? e.message}`,
        );
      }
    }
  };

  const buildPreviewLogs = async (uploadId) => {
    try {
      const preview = await getUploadPreview(uploadId);
      setPreviewLogs(preview.preview_logs ?? []);
    } catch (e) {
      setPreviewLogs([]);
      toast.error(
        `Failed to load log preview: ${e.friendlyMessage ?? e.message}`,
      );
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFile?.backendId === fileId) {
      setSelectedFile(null);
      setValidationData(null);
      setPreviewLogs([]);
    }
    toast.info("File removed from queue");
  };

  const handleAnalyze = async (targetFile = null, force = false) => {
    if (isProcessing) {
      return;
    }

    const isEventObject =
      targetFile &&
      typeof targetFile === "object" &&
      (typeof targetFile.preventDefault === "function" ||
        Object.prototype.hasOwnProperty.call(targetFile, "nativeEvent"));

    const normalizedTargetFile = isEventObject ? null : targetFile;
    const fileToAnalyze = normalizedTargetFile ?? selectedFile;
    const backendId =
      fileToAnalyze && typeof fileToAnalyze === "object"
        ? (fileToAnalyze.backendId ?? fileToAnalyze.id)
        : null;

    if (!fileToAnalyze || !backendId) {
      toast.error("Please select a valid uploaded file to analyze.");
      return;
    }

    // Keep AI panel synced with whichever file is being analyzed.
    if (fileToAnalyze?.name) {
      setSelectedFile({ name: fileToAnalyze.name, backendId });
    }

    setIsProcessing(true);
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === backendId ? { ...f, status: "processing" } : f,
      ),
    );
    setUploadHistory((prev) =>
      prev.map((h) => (h.id === backendId ? { ...h, status: "processing" } : h)),
    );

    try {
      const result = await analyzeUploadFile(backendId, { force });
      const nextStatus = result.status === "completed" ? "completed" : "pending";
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === backendId
            ? {
                ...f,
                status: nextStatus,
                progress: nextStatus === "completed" ? 100 : f.progress,
              }
            : f,
        ),
      );
      setUploadHistory((prev) =>
        prev.map((h) =>
          h.id === backendId
            ? {
                ...h,
                status: nextStatus,
                threats_found: result.threats_found ?? h.threats_found ?? 0,
                clean_logs: result.clean_logs ?? h.clean_logs ?? 0,
              }
            : h,
        ),
      );
      setValidationData({
        totalLogs: result.total_logs ?? 0,
        validLogs: result.valid_logs ?? 0,
        invalidLogs: result.invalid_logs ?? 0,
        parsingErrors: result.parse_errors ?? 0,
      });
      if (nextStatus === "completed") {
        toast.success(
          `AI analysis completed: ${result.threats_found ?? 0} threats found, ${result.clean_logs ?? 0} clean logs.`,
        );
      } else if (result.already_queued) {
        toast.info(
          `Analysis already queued${result.queue_position ? ` (position ${result.queue_position})` : ""}.`,
        );
      } else {
        toast.success(
          `Analysis queued${result.queue_position ? ` (position ${result.queue_position})` : ""}.`,
        );
      }
      await fetchHistory();
    } catch (e) {
      const failureMessage =
        e.friendlyMessage ?? e.message ?? "Analysis interrupted or timed out.";
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === backendId ? { ...f, status: "failed" } : f)),
      );
      setUploadHistory((prev) =>
        prev.map((h) =>
          h.id === backendId
            ? { ...h, status: "failed", error_message: failureMessage }
            : h,
        ),
      );
      try {
        await markUploadAnalysisFailed(backendId, failureMessage);
      } catch {
        // Backend may be unavailable in timeout/interrupted cases.
      }
      toast.error(
        `AI analysis failed or timed out: ${failureMessage}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewHistoryLogs = async (item) => {
    setSelectedFile({ name: item.filename, backendId: item.id });
    setValidationData({
      totalLogs: item.total_logs ?? 0,
      validLogs: item.valid_logs ?? 0,
      invalidLogs: item.invalid_logs ?? 0,
      parsingErrors: item.parse_errors ?? 0,
    });
    await buildPreviewLogs(item.id);
    toast.success(`Loaded preview for ${item.filename}`);
  };

  const handleReanalyzeFromHistory = async (item) => {
    if (isProcessing) return;
    if (!item?.id) {
      toast.error("Unable to reanalyze: missing upload id.");
      return;
    }
    setSelectedFile({ name: item.filename, backendId: item.id });
    await handleAnalyze({ name: item.filename, backendId: item.id }, true);
  };

  const handleDeleteHistoryItem = async (item) => {
    if (isProcessing) return;
    try {
      await deleteUpload(item.id);
      setUploadHistory((prev) => prev.filter((h) => h.id !== item.id));
      setUploadedFiles((prev) => prev.filter((f) => f.id !== item.id));

      if (selectedFile?.backendId === item.id) {
        setSelectedFile(null);
        setValidationData(null);
        setPreviewLogs([]);
      }

      toast.success(`Deleted ${item.filename} from upload history.`);
    } catch (e) {
      toast.error(
        `Failed to delete ${item.filename}: ${e.friendlyMessage ?? e.message}`,
      );
    }
  };

  return {
    uploadedFiles,
    selectedFile: selectedFile?.name ?? null,
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
  };
}
