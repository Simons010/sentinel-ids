import { Brain, Calendar, Database, GitBranch } from "lucide-react";

export function ModelInfoPanel({ data }) {
  const model_info = [
    { icon: Brain, label: "Model Type", value: data?.type ?? "Random Forest" },
    {
      icon: GitBranch,
      label: "Detection Method",
      value: "Supervised + Anomaly",
    },
    {
      icon: Database,
      label: "Model Version",
      value: data?.version ?? "v2.4.1",
    },
    {
      icon: Calendar,
      label: "Last Training",
      value: data?.last_training ?? "March 4, 2026",
    },
    {
      icon: Database,
      label: "Dataset Size",
      value: data?.dataset_size
        ? `${data.dataset_size.toLocaleString()} samples`
        : "--",
    },
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Model Information
          </h3>
          <p className="text-sm text-gray-400">AI Detection Engine Details</p>
        </div>
      </div>

      <div className="space-y-4">
        {model_info.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#22D3EE] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#22D3EE]" />
                </div>
                <span className="text-gray-400 text-sm">{item.label}</span>
              </div>
              <span className="text-white font-medium text-sm">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[#334155]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Model Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#10B981]">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
