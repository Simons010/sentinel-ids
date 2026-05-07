export function ConfusionMatrix({ data }) {
  const tp = data?.tp ?? 0;
  const tn = data?.tn ?? 0;
  const fp = data?.fp ?? 0;
  const fn = data?.fn ?? 0;
  const total = tp + tn + fp + fn || 0;
  const accuracy = total > 0 ? (((tp + tn) / total) * 100).toFixed(1) : "0.0";

  const matrixData = [
    {
      label: "True Positive",
      abbr: "TP",
      description: "Correctly identified threats",
      value: tp,
      color: "bg-[#10B981]",
      textColor: "text-[#10B981]",
    },
    {
      label: "False Positive",
      abbr: "FP",
      description: "Normal traffic flagged as threat",
      value: fp,
      color: "bg-[#F59E0B]",
      textColor: "text-[#F59E0B]",
    },
    {
      label: "False Negative",
      abbr: "FN",
      description: "Missed threats (Rules-only)",
      value: fn,
      color: "bg-[#EF4444]",
      textColor: "text-[#EF4444]",
    },
    {
      label: "True Negative",
      abbr: "TN",
      description: "Correctly identified normal logs",
      value: tn,
      color: "bg-[#22D3EE]",
      textColor: "text-[#22D3EE]",
    },
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Confusion Matrix</h3>
          <p className="text-xs text-gray-400 mt-1">
            AI Precision vs. System Decision
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{accuracy}%</span>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
            Overall Accuracy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {matrixData.map((item, index) => (
          <div
            key={index}
            className={`${item.color} bg-opacity-5 border border-white/5 rounded-xl p-4 transition-all hover:bg-opacity-10 relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className={`text-xs font-bold ${item.textColor} mb-1 block`}>
                  {item.abbr}
                </span>
                <h4 className="text-sm font-semibold text-gray-200">
                  {item.label}
                </h4>
              </div>
              <div className={`text-2xl font-mono font-bold ${item.textColor}`}>
                {item.value.toLocaleString()}
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
              {item.description}
            </p>
            
            {/* Background decoration */}
            <div className={`absolute -right-2 -bottom-2 w-12 h-12 ${item.color} opacity-[0.03] rounded-full blur-xl group-hover:opacity-[0.08] transition-opacity`} />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#334155]/50 flex justify-between items-center text-xs">
        <span className="text-gray-500 italic">
          Threshold: 0.5 (AI Confidence)
        </span>
        <span className="text-gray-400 font-medium">
          Total Analyzed: <span className="text-white">{total.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
