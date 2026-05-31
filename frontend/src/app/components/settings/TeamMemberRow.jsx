import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export function TeamMemberRow({ member, onActivate, onRemove }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-[#334155] hover:border-[#475569] transition-all">
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
        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#22D3EE]/20 text-[#22D3EE] capitalize">
          {member.role}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={member.status === "active"}
          onClick={() => onActivate(member.id)}
          className={`text-xs border-[#334155] ${member.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "text-gray-400"}`}
        >
          {member.status}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
              aria-label={"Remove " + member.name}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#0F172A] border-[#334155] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to remove {member.name}? This will revoke their access to the system. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#1E293B] border-[#334155] text-gray-300 hover:bg-[#334155] hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onRemove(member.id)}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
