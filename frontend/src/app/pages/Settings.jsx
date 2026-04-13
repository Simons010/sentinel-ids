import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Bell, Shield, Database, Cpu, Mail, Save } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export default function Settings() {
  const {
    settings,
    loading,
    saving,
    error,
    isDirty,
    setField,
    resetChanges,
    saveChanges,
  } = useSettings();

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Configure your security preferences and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-sm text-gray-400">Manage alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingSwitch
              title="Email Alerts"
              description="Receive critical alerts via email"
              checked={settings.email_alerts}
              onCheckedChange={(v) => setField("email_alerts", v)}
            />
            <SettingSwitch
              title="Push Notifications"
              description="Browser push notifications"
              checked={settings.push_notifications}
              onCheckedChange={(v) => setField("push_notifications", v)}
            />
            <SettingSwitch
              title="Slack Integration"
              description="Send alerts to Slack channel"
              checked={settings.slack_integration}
              onCheckedChange={(v) => setField("slack_integration", v)}
            />
            <SettingSwitch
              title="SMS Alerts"
              description="Critical threats only"
              checked={settings.sms_alerts}
              onCheckedChange={(v) => setField("sms_alerts", v)}
            />
          </div>
        </div>

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
              <Label className="text-white mb-2 block">Session Timeout (minutes)</Label>
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
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Email Configuration</h3>
            <p className="text-sm text-gray-400">SMTP settings for notifications</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white mb-2 block">SMTP Server</Label>
            <Input
              type="text"
              value={settings.smtp_server}
              onChange={(e) => setField("smtp_server", e.target.value)}
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Port</Label>
            <Input
              type="number"
              value={settings.smtp_port}
              onChange={(e) => setField("smtp_port", e.target.value)}
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Username</Label>
            <Input
              type="email"
              value={settings.smtp_username}
              onChange={(e) => setField("smtp_username", e.target.value)}
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Password</Label>
            <Input
              type="password"
              value={settings.smtp_password}
              onChange={(e) => setField("smtp_password", e.target.value)}
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          disabled={!isDirty || saving}
          onClick={resetChanges}
          className="border-[#334155] bg-gray-400 hover:bg-gray-600 hover:text-zinc-300 disabled:opacity-50"
        >
          Cancel
        </Button>
        <Button
          onClick={saveChanges}
          disabled={!isDirty || saving}
          className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function SettingSwitch({ title, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
