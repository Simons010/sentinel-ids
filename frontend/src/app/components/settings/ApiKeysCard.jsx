import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "../ui/button";
import { GenerateApiKeyDialog } from "./GenerateApiKeyDialog";

export function ApiKeysCard({ apiKeys, onRevoke, onGenerate }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
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
          {apiKeys.length === 0 ? (
            <p className="text-sm text-gray-400">No API keys generated yet.</p>
          ) : (
            apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg gap-4"
              >
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{apiKey.name}</p>
                  <p className="text-sm text-gray-400 font-mono truncate">
                    {apiKey.key}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created:{" "}
                    {new Date(apiKey.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!apiKey.is_active}
                  onClick={() => onRevoke(apiKey.id)}
                  className="bg-red-600 text-white hover:bg-red-700 shrink-0 disabled:opacity-50"
                >
                  {apiKey.is_active ? "Revoke" : "Revoked"}
                </Button>
              </div>
            ))
          )}
          <Button
            type="button"
            className="w-fit bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white"
            onClick={() => setDialogOpen(true)}
          >
            Generate New API Key
          </Button>
        </div>
      </div>

      <GenerateApiKeyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onGenerate}
      />
    </>
  );
}
