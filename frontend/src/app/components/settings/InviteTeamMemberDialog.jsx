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

const ROLE_OPTIONS = [
  { value: "viewer", label: "Viewer" },
  { value: "analyst", label: "Analyst" },
  { value: "admin", label: "Admin" },
];

export function InviteTeamMemberDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setRole("viewer");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    const ok = await onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
    });
    setSubmitting(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E293B] border-[#334155] text-white sm:max-w-md [&_button[data-slot=dialog-close]]:text-gray-400 [&_button[data-slot=dialog-close]]:hover:text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Invite team member</DialogTitle>
            <DialogDescription className="text-gray-400">
              They will appear as pending until you activate them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invite-name" className="text-white">
                Name
              </Label>
              <Input
                id="invite-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0F172A] border-[#334155] text-white"
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email" className="text-white">
                Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0F172A] border-[#334155] text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role" className="text-white">
                Role
              </Label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] text-white rounded-lg px-3 py-2"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#334155] bg-transparent text-white hover:bg-[#0F172A] hover:text-white"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !name.trim() || !email.trim()}
              className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white"
            >
              {submitting ? "Sending…" : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
