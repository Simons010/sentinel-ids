import { Database } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SettingSwitch } from "./SettingSwitch";

export function DatabaseSettingsCard({ settings, setField }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-lg flex items-center justify-center">
          <Database className="w-5 h-5 text-[#F59E0B]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Database</h3>
          <p className="text-sm text-gray-400">Data retention and storage</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Log Retention Period</Label>
          <select
            className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-lg px-3 py-2"
            value={settings.retention_days}
            onChange={(e) => setField("retention_days", e.target.value)}
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>1 year</option>
          </select>
        </div>
        <div>
          <Label className="text-white mb-2 block">Archive Location</Label>
          <Input
            type="text"
            value={settings.archive_location}
            onChange={(e) => setField("archive_location", e.target.value)}
            className="bg-[#0F172A] border-[#334155] text-white"
          />
        </div>
        <SettingSwitch
          title="Auto-Archive Old Logs"
          description="Compress logs older than retention period"
          checked={settings.auto_archive}
          onCheckedChange={(v) => setField("auto_archive", v)}
        />
      </div>
    </div>
  );
}
