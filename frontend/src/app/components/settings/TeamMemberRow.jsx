import { Button } from "../ui/button";

export function TeamMemberRow({ member, onActivate }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{member.name}</p>
          <p className="text-sm text-gray-400 truncate">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#22D3EE]/20 text-[#22D3EE]">
          {member.role}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={member.status === "Active"}
          onClick={() => onActivate(member.id)}
          className="text-xs"
        >
          {member.status}
        </Button>
      </div>
    </div>
  );
}
