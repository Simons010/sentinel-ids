import { Mail } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function EmailSettingsCard({ settings, setField }) {
  return (
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
  );
}
