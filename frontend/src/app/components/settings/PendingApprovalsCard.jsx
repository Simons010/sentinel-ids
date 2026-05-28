import { useState, useEffect } from "react";
import {
  UserCheck,
  UserX,
  Clock,
  ShieldAlert,
  Check,
  X,
  User,
} from "lucide-react";
import { getPendingUsers, approveUser } from "../../../api/auth";
import { toast } from "sonner";

export function PendingApprovalsCard({ onActionSuccess }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingUsers();
      setPendingUsers(data);
    } catch (error) {
      console.error("Failed to fetch pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (userId, approved) => {
    try {
      await approveUser(userId, approved);
      toast.success(
        approved ? "User approved successfully" : "User registration rejected",
        {
          className: "bg-[#0F172A] border-emerald-500/50 text-white border-2",
        },
      );
      fetchPending();
      if (approved && onActionSuccess) {
        onActionSuccess();
      }
    } catch (error) {
      toast.error("Action failed", {
        description: error.response?.data?.message || "An error occurred",
        className: "bg-[#0F172A] border-red-500/50 text-white border-2",
      });
    }
  };

  if (loading && pendingUsers.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6 animate-pulse">
        <div className="h-6 w-48 bg-[#334155] rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-[#334155] rounded"></div>
          <div className="h-12 bg-[#334155] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Pending Approvals
            </h3>
            <p className="text-sm text-gray-400">
              Review new user registrations
            </p>
          </div>
        </div>
        <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-500/20">
          {pendingUsers.length} Pending
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 bg-[#0F172A]/50 rounded-lg border border-dashed border-[#334155]">
            <UserCheck className="w-10 h-10 text-gray-600 mx-auto mb-2 opacity-20" />
            <p className="text-sm text-gray-500">
              No pending registrations at the moment.
            </p>
          </div>
        ) : (
          pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-[#0F172A]/50 rounded-lg border border-[#334155] hover:border-[#475569] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#475569] to-[#1E293B] rounded-full flex items-center justify-center text-sm font-bold text-white border border-[#334155]">
                  {user.username?.charAt(0).toUpperCase() || (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {user.username}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">
                      {user.role || "Viewer"}
                    </span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(user.date_joined).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(user.id, false)}
                  className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  title="Reject User"
                  aria-label={"Reject user " + user.username}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleAction(user.id, true)}
                  className="p-2 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors border border-transparent hover:border-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  title="Approve User"
                  aria-label={"Approve user " + user.username}
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
