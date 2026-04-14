import { Save } from "lucide-react";
import { Button } from "../ui/button";

export function SettingsSaveBar({ isDirty, saving, onCancel, onSave }) {
  return (
    <div className="flex justify-end gap-4 mb-6">
      <Button
        variant="outline"
        disabled={!isDirty || saving}
        onClick={onCancel}
        className="border-[#334155] bg-gray-400 hover:bg-gray-600 hover:text-zinc-300 disabled:opacity-50"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={!isDirty || saving}
        className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white disabled:opacity-50"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
