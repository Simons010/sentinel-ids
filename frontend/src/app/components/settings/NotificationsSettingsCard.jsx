import { Bell } from "lucide-react";
import { SettingSwitch } from "./SettingSwitch";

export function NotificationsSettingsCard({ settings, setField }) {
  return (
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
  );
}
