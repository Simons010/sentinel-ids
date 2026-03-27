import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Bell,
  Shield,
  Database,
  Cpu,
  Mail,
  Key,
  Users,
  Save,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Configure your security preferences and system settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
              <p className="text-sm text-gray-400">Manage alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Alerts</p>
                <p className="text-sm text-gray-400">
                  Receive critical alerts via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">
                  Browser push notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Slack Integration</p>
                <p className="text-sm text-gray-400">
                  Send alerts to Slack channel
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Alerts</p>
                <p className="text-sm text-gray-400">Critical threats only</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security Settings */}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-400">
                  Enhanced account security
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Block Threats</p>
                <p className="text-sm text-gray-400">
                  Automatically block detected threats
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">IP Whitelisting</p>
                <p className="text-sm text-gray-400">Allow trusted IPs only</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Session Timeout</p>
                <p className="text-sm text-gray-400">
                  Auto logout after 30 minutes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Database</h3>
              <p className="text-sm text-gray-400">
                Data retention and storage
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">
                Log Retention Period
              </Label>
              <select
                className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-lg px-3 py-2"
                defaultValue="90 days"
              >
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
                <option>180 days</option>
                <option>1 year</option>
              </select>
            </div>
            <div>
              <Label className="text-white mb-2 block">Archive Location</Label>
              <Input
                type="text"
                placeholder="/var/log/sentinel-ids/archives"
                className="bg-[#0F172A] border-[#334155] text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Archive Old Logs</p>
                <p className="text-sm text-gray-400">
                  Compress logs older than 60 days
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#EF4444]/20 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Models</h3>
              <p className="text-sm text-gray-400">
                Machine learning configuration
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Detection Model</Label>
              <select
                className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-lg px-3 py-2"
                defaultValue="Advanced (Balanced)"
              >
                <option>Standard (Fast)</option>
                <option>Advanced (Balanced)</option>
                <option>Deep Learning (Accurate)</option>
              </select>
            </div>
            <div>
              <Label className="text-white mb-2 block">
                Confidence Threshold
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="60"
                  max="99"
                  defaultValue="85"
                  className="flex-1"
                />
                <span className="text-white font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Continuous Learning</p>
                <p className="text-sm text-gray-400">
                  Update model with new threats
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Email Configuration
            </h3>
            <p className="text-sm text-gray-400">
              SMTP settings for notifications
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white mb-2 block">SMTP Server</Label>
            <Input
              type="text"
              placeholder="smtp.example.com"
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Port</Label>
            <Input
              type="text"
              placeholder="587"
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Username</Label>
            <Input
              type="email"
              placeholder="alerts@sentinel-ids.com"
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-[#0F172A] border-[#334155] text-white"
            />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">API Keys</h3>
            <p className="text-sm text-gray-400">Manage integration API keys</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Production API Key",
              key: "sk_prod_a8f3d2...",
              created: "Jan 15, 2026",
            },
            {
              name: "Development API Key",
              key: "sk_dev_b9e4f1...",
              created: "Feb 1, 2026",
            },
            {
              name: "Webhook Integration",
              key: "wh_sec_c7d5a2...",
              created: "Feb 8, 2026",
            },
          ].map((apiKey, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg"
            >
              <div>
                <p className="text-white font-medium">{apiKey.name}</p>
                <p className="text-sm text-gray-400 font-mono">{apiKey.key}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {apiKey.created}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700 hover:-text-white"
              >
                Revoke
              </Button>
            </div>
          ))}
          <Button className="w-fit bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white">
            Generate New API Key
          </Button>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F97316]/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-[#F97316]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Team Members</h3>
            <p className="text-sm text-gray-400">
              Manage user access and permissions
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              name: "Sarah Johnson",
              email: "sarah.j@company.com",
              role: "Admin",
              status: "Active",
            },
            {
              name: "Michael Chen",
              email: "michael.c@company.com",
              role: "Analyst",
              status: "Active",
            },
            {
              name: "Emily Rodriguez",
              email: "emily.r@company.com",
              role: "Viewer",
              status: "Active",
            },
            {
              name: "David Kim",
              email: "david.k@company.com",
              role: "Analyst",
              status: "Pending",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center text-white font-semibold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    member.role === "Admin"
                      ? "bg-[#EF4444]/20 text-[#EF4444]"
                      : member.role === "Analyst"
                        ? "bg-[#22D3EE]/20 text-[#22D3EE]"
                        : "bg-[#10B981]/20 text-[#10B981]"
                  }`}
                >
                  {member.role}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    member.status === "Active"
                      ? "text-gray-400"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
          <Button className="w-fit bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white">
            Invite Team Member
          </Button>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="border-[#334155] bg-gray-400 hover:bg-gray-600 hover:text-zinc-300"
        >
          Cancel
        </Button>
        <Button className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#334155]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>© 2026 Sentinel-IDS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>System version: v2.4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
