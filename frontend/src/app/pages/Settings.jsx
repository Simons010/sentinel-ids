import { useSettings } from "../hooks/useSettings";
import { useAuth } from "../context/AuthContext";
import { UserProfileCard } from "../components/settings/UserProfileCard";
import { PendingApprovalsCard } from "../components/settings/PendingApprovalsCard";
import { NotificationsSettingsCard } from "../components/settings/NotificationsSettingsCard";
import { SecuritySettingsCard } from "../components/settings/SecuritySettingsCard";
import { DatabaseSettingsCard } from "../components/settings/DatabaseSettingsCard";
import { AiModelsSettingsCard } from "../components/settings/AiModelsSettingsCard";
import { SettingsSaveBar } from "../components/settings/SettingsSaveBar";
import { EmailSettingsCard } from "../components/settings/EmailSettingsCard";
import { ApiKeysCard } from "../components/settings/ApiKeysCard";
import { TeamMembersCard } from "../components/settings/TeamMembersCard";
import { SettingsLoadingSkeleton } from "../components/PageLoadingSkeletons";

export default function Settings() {
  const { user } = useAuth();
  const {
    settings,
    loading,
    saving,
    error,
    apiKeys,
    teamMembers,
    isDirty,
    setField,
    resetChanges,
    saveChanges,
    generateApiKey,
    revokeKey,
    inviteMember,
    activateMember,
    removeMember,
    refetch,
  } = useSettings();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (loading) return <SettingsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Configure your security preferences and system settings
        </p>
      </div>

      {/* <UserProfileCard user={user} /> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserProfileCard user={user} />
        {user?.is_superuser && (
          <PendingApprovalsCard onActionSuccess={refetch} />
        )}
        <NotificationsSettingsCard settings={settings} setField={setField} />
        <SecuritySettingsCard settings={settings} setField={setField} />{" "}
        <DatabaseSettingsCard settings={settings} setField={setField} />
        <AiModelsSettingsCard settings={settings} setField={setField} />
        <ApiKeysCard
          apiKeys={apiKeys}
          onGenerate={generateApiKey}
          onRevoke={revokeKey}
        />
        <TeamMembersCard
          teamMembers={teamMembers}
          onInvite={inviteMember}
          onActivate={activateMember}
          onRemove={removeMember}
        />
      </div>

      <EmailSettingsCard settings={settings} setField={setField} />

      <SettingsSaveBar
        isDirty={isDirty}
        saving={saving}
        onCancel={resetChanges}
        onSave={saveChanges}
      />
    </div>
  );
}
