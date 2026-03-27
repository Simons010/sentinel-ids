import { Brain, Cpu } from "lucide-react";

export function AIAnalysisControls({ selectedFile, onAnalyze, isProcessing }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center flex-shrink-0">
          <Brain className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Analysis Engine
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Run machine learning analysis to detect anomalies and potential
            cyber threats in the uploaded logs.
          </p>

          {/* Model Info */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-[#0F172A] rounded-lg">
            <Cpu className="w-5 h-5 text-[#22D3EE]" />
            <div>
              <p className="text-sm font-medium text-white">
                Random Forest IDS Model
              </p>
              <p className="text-xs text-gray-400">
                Version 2.4.1 • Detection Accuracy: 98.2%
              </p>
            </div>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="mb-4 p-3 bg-[#0F172A] border border-[#334155] rounded-lg">
              <p className="text-xs text-gray-400 mb-1">
                Selected for Analysis:
              </p>
              <p className="text-sm font-medium text-white">{selectedFile}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={onAnalyze}
            disabled={!selectedFile || isProcessing}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedFile && !isProcessing
                ? "bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white hover:shadow-lg hover:shadow-[#22D3EE]/30"
                : "bg-[#334155] text-gray-500 cursor-not-allowed animate-pulse"
            }`}
          >
            <Brain className="w-5 h-5" />
            {isProcessing ? "Analyzing..." : "Analyze with AI"}
          </button>
        </div>
      </div>
    </div>
  );
}
