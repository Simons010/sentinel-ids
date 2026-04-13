import { useSettings } from "../hooks/useSettings";
import { NotificationsSettingsCard } from "../components/settings/NotificationsSettingsCard";
import { SecuritySettingsCard } from "../components/settings/SecuritySettingsCard";
import { DatabaseSettingsCard } from "../components/settings/DatabaseSettingsCard";
import { AiModelsSettingsCard } from "../components/settings/AiModelsSettingsCard";
import { SettingsSaveBar } from "../components/settings/SettingsSaveBar";
import { EmailSettingsCard } from "../components/settings/EmailSettingsCard";
import { ApiKeysCard } from "../components/settings/ApiKeysCard";
import { TeamMembersCard } from "../components/settings/TeamMembersCard";

export default function Settings() {
  const {
    settings,
    loading,
    saving,
    error,
    isDirty,
    apiKeys,
    teamMembers,
    setField,
    resetChanges,
    saveChanges,
    generateApiKey,
    revokeKey,
    inviteMember,
    activateMember,
  } = useSettings();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Configure your security preferences and system settings
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
        </div>
        <div className="h-48 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-12 max-w-md ml-auto bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-56 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-56 bg-gray-800 rounded-lg animate-pulse" />
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
        <NotificationsSettingsCard settings={settings} setField={setField} />
        <SecuritySettingsCard settings={settings} setField={setField} />
        <DatabaseSettingsCard settings={settings} setField={setField} />
        <AiModelsSettingsCard settings={settings} setField={setField} />
      </div>

      <EmailSettingsCard settings={settings} setField={setField} />

      <SettingsSaveBar
        isDirty={isDirty}
        saving={saving}
        onCancel={resetChanges}
        onSave={saveChanges}
      />

      <ApiKeysCard
        apiKeys={apiKeys}
        onRevoke={revokeKey}
        onGenerate={generateApiKey}
      />

      <TeamMembersCard
        teamMembers={teamMembers}
        onInvite={inviteMember}
        onActivate={activateMember}
      />
    </div>
  );
}
