export function ConfusionMatrix() {
  const matrixData = [
    { label: 'True Positive', value: 8452, color: 'bg-[#10B981]', textColor: 'text-[#10B981]' },
    { label: 'False Positive', value: 287, color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' },
    { label: 'False Negative', value: 143, color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
    { label: 'True Negative', value: 9876, color: 'bg-[#22D3EE]', textColor: 'text-[#22D3EE]' }
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Confusion Matrix</h3>
      <div className="space-y-4">
        {/* Matrix Grid */}
        <div className="grid grid-cols-2 gap-4">
          {matrixData.map((item, index) => (
            <div
              key={index}
              className={`${item.color} bg-opacity-10 border-2 ${item.color.replace('bg-', 'border-')} rounded-lg p-6 text-center transition-all hover:bg-opacity-20`}
            >
              <div className={`text-3xl font-bold ${item.textColor} mb-2`}>
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-300">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Accuracy Calculation */}
        <div className="pt-4 border-t border-[#334155]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Matrix Accuracy</span>
            <span className="text-white font-semibold">
              {(((8452 + 9876) / (8452 + 287 + 143 + 9876)) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
