import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { InviteTeamMemberDialog } from "./InviteTeamMemberDialog";
import { TeamMemberRow } from "./TeamMemberRow";

export function TeamMembersCard({ teamMembers, onInvite, onActivate }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
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
          {teamMembers.length === 0 ? (
            <p className="text-sm text-gray-400">No team members added yet.</p>
          ) : (
            teamMembers.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                onActivate={onActivate}
              />
            ))
          )}
          <Button
            type="button"
            className="w-fit bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-white"
            onClick={() => setDialogOpen(true)}
          >
            Invite Team Member
          </Button>
        </div>
      </div>

      <InviteTeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onInvite}
      />
    </>
  );
}
