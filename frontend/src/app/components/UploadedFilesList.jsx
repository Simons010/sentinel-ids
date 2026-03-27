import {
  File,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function UploadedFilesList({ files, onRemoveFile }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "uploading":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22D3EE]/20 text-[#22D3EE]">
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading
          </span>
        );
      case "ready":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#10B981]/20 text-[#10B981]">
            <CheckCircle className="w-3 h-3" />
            Ready for Analysis
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/20 text-[#F59E0B]">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#10B981]/20 text-[#10B981]">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EF4444]/20 text-[#EF4444]">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Uploaded Files</h3>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 hover:border-[#22D3EE]/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div className="w-10 h-10 bg-[#22D3EE] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-[#22D3EE]" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {file.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {getStatusBadge(file.status)}
                    {onRemoveFile && file.status !== "processing" && (
                      <button
                        onClick={() => onRemoveFile(file.id)}
                        className="p-1 hover:bg-[#EF4444]/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-[#EF4444]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {(file.status === "uploading" ||
                  file.status === "processing") && (
                  <div className="mt-2">
                    <div className="w-full bg-[#334155] rounded-full h-1.5">
                      <div
                        className="bg-[#22D3EE] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {file.progress}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
