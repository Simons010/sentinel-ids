import { Switch } from "../ui/switch";

export function SettingSwitch({ title, description, checked, onCheckedChange }) {
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
