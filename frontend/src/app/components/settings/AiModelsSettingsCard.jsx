import { Cpu } from "lucide-react";
import { Label } from "../ui/label";
import { SettingSwitch } from "./SettingSwitch";

export function AiModelsSettingsCard({ settings, setField }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#EF4444]/20 rounded-lg flex items-center justify-center">
          <Cpu className="w-5 h-5 text-[#EF4444]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Models</h3>
          <p className="text-sm text-gray-400">Machine learning configuration</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Detection Model</Label>
          <select
            className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-lg px-3 py-2"
            value={settings.ai_model_mode}
            onChange={(e) => setField("ai_model_mode", e.target.value)}
          >
            <option value="standard">Standard (Fast)</option>
            <option value="advanced">Advanced (Balanced)</option>
            <option value="deep">Deep Learning (Accurate)</option>
          </select>
        </div>
        <div>
          <Label className="text-white mb-2 block">Confidence Threshold</Label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="60"
              max="99"
              value={settings.ai_sensitivity}
              onChange={(e) => setField("ai_sensitivity", e.target.value)}
              className="flex-1"
            />
            <span className="text-white font-medium">
              {settings.ai_sensitivity}%
            </span>
          </div>
        </div>
        <SettingSwitch
          title="Continuous Learning"
          description="Update model with new threats"
          checked={settings.continuous_learning}
          onCheckedChange={(v) => setField("continuous_learning", v)}
        />
      </div>
    </div>
  );
}
