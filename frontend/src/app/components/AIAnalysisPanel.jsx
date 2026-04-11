import { Brain, TrendingUp } from "lucide-react";

export function AIAnalysisPanel({ data }) {
  const result = data?.result ?? "No analysis available";
  const description =
    data?.description ?? "No recent suspicious activity detected.";
  const confidence = data?.confidence ?? 0;
  const severity = data?.severity ?? "Informational";
  const severity_score = data?.severity_score ?? 0;

  const riskColor =
    severity === "critical"
      ? "#EF4444"
      : severity === "high"
        ? "#F97316"
        : severity === "medium"
          ? "#F59E0B"
          : "#10B981";

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-[#22D3EE]" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          AI Analysis Summary
        </h3>
      </div>

      {/* Latest Classification */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">Latest NLP Classification</p>
          <span className="text-xs text-[#22D3EE] font-mono">v2.4.1</span>
        </div>
        <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
          <p className="text-white mb-2">
            <span className="font-semibold">Result: </span>
            {result}
          </p>
          <span className="text-sm text-gray-400">{description}</span>
        </div>
      </div>

      {/* Extracted Keywords */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Extracted Keywords</p>
        <div className="flex flex-wrap gap-2">
          {[
            "SQL Injection",
            "Privilege Escalation",
            "Lateral Movement",
            "Data Exfiltration",
            "Zero-Day",
          ].map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-[#EF4444]/20 text-[#EF4444] text-xs font-semibold rounded-full border border-[#EF4444]/30"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Risk Probability */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">Risk Level</p>
          <span
            className="text-sm font-bold capitalize"
            style={{ color: riskColor }}
          >
            {severity}
          </span>
        </div>
        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${severity_score}%`, backgroundColor: riskColor }}
          />
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">Model Confidence</p>
          <span className="text-sm font-bold text-[#10B981]">
            {confidence}%
          </span>
        </div>
        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#10B981] rounded-full"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Suggested Action */}
      <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#F97316]/10 rounded-lg p-4 border border-[#EF4444]/30">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-[#EF4444] mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white mb-1">
              Suggested Mitigation
            </p>
            <p className="text-xs text-gray-300">
              1. Block source IPs immediately
              <br />
              2. Enable enhanced monitoring on targeted systems
              <br />
              3. Review and patch vulnerable endpoints
              <br />
              4. Initiate incident response protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
