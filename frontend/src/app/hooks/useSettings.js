import { useEffect, useMemo, useState } from "react";
import { getSettings, updateSettings } from "../../api/settings";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  email_alerts: true,
  push_notifications: false,
  slack_integration: false,
  sms_alerts: false,
  two_factor_auth: false,
  auto_block_threats: false,
  ip_whitelisting: false,
  session_timeout: 30,
  retention_days: 90,
  archive_location: "/var/log/sentinel-ids/archives",
  auto_archive: true,
  ai_model_mode: "advanced",
  continuous_learning: true,
  ai_sensitivity: 85,
  smtp_server: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      const next = { ...DEFAULT_SETTINGS, ...data };
      setSettings(next);
      setInitialSettings(next);
      setError(null);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [settings, initialSettings],
  );

  const setField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const resetChanges = () => {
    setSettings(initialSettings);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      const payload = {
        ...settings,
        session_timeout: Number(settings.session_timeout) || 30,
        retention_days: Number(settings.retention_days) || 90,
        ai_sensitivity: Number(settings.ai_sensitivity) || 85,
        smtp_port: Number(settings.smtp_port) || 587,
      };
      const updated = await updateSettings(payload);
      const next = { ...DEFAULT_SETTINGS, ...updated };
      setSettings(next);
      setInitialSettings(next);
      toast.success("Settings updated successfully");
      return true;
    } catch (e) {
      toast.error(e.friendlyMessage || "Failed to save settings");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    isDirty,
    setField,
    resetChanges,
    saveChanges,
    refetch: fetchSettings,
  };
}
