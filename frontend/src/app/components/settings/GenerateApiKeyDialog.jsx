import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function GenerateApiKeyDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("Generated API Key");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName("Generated API Key");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onSubmit((name || "").trim() || "Generated API Key");
    setSubmitting(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-md [&_button[data-slot=dialog-close]]:text-gray-400 [&_button[data-slot=dialog-close]]:hover:text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Generate API key</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose a label so you can recognize this key in the list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="settings-api-key-name" className="text-white">
              Name
            </Label>
            <Input
              id="settings-api-key-name"
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0F172A] border-[#334155] text-white"
              placeholder="e.g. Production webhook"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#334155] bg-transparent text-white hover:bg-[#0F172A]"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white"
            >
              {submitting ? "Generating…" : "Generate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
