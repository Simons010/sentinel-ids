import { Upload, File } from "lucide-react";
import { useState } from "react";

export function FileUploadArea({ onFilesSelected }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Upload Log Files
      </h3>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? "border-[#22D3EE] bg-[#22D3EE]/5"
            : "border-[#334155] hover:border-[#22D3EE]/50"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".csv,.json,.txt,.log"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white animate-pulse" />
          </div>

          <div>
            <p className="text-lg font-medium text-white mb-2">
              Drag and drop log files here
            </p>
            <p className="text-sm text-gray-400 mb-4">
              or click to browse your files
            </p>
          </div>

          <label
            htmlFor="file-upload"
            className="px-6 py-2.5 bg-[#22D3EE] text-white font-medium rounded-lg hover:bg-[#0EA5E9] transition-colors cursor-pointer"
          >
            Browse Files
          </label>

          <div className="mt-4 pt-4 border-t border-[#334155] w-full">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4" />
                <span>Supported: CSV, JSON, TXT, LOG</span>
              </div>
              <div>
                <span>Max size: 50 MB per file</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
