import { Shield } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SettingSwitch } from "./SettingSwitch";

export function SecuritySettingsCard({ settings, setField }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Security</h3>
          <p className="text-sm text-gray-400">System security options</p>
        </div>
      </div>
      <div className="space-y-4">
        <SettingSwitch
          title="Two-Factor Authentication"
          description="Enhanced account security"
          checked={settings.two_factor_auth}
          onCheckedChange={(v) => setField("two_factor_auth", v)}
        />
        <SettingSwitch
          title="Auto-Block Threats"
          description="Automatically block detected threats"
          checked={settings.auto_block_threats}
          onCheckedChange={(v) => setField("auto_block_threats", v)}
        />
        <SettingSwitch
          title="IP Whitelisting"
          description="Allow trusted IPs only"
          checked={settings.ip_whitelisting}
          onCheckedChange={(v) => setField("ip_whitelisting", v)}
        />
        <div>
          <Label className="text-white mb-2 block">
            Session Timeout (minutes)
          </Label>
          <Input
            type="number"
            min="5"
            max="240"
            value={settings.session_timeout}
            onChange={(e) => setField("session_timeout", e.target.value)}
            className="bg-[#0F172A] border-[#334155] text-white"
          />
        </div>
      </div>
    </div>
  );
}
