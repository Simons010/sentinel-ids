import { User, BadgeCheck, ShieldCheck, Mail } from "lucide-react";

export function UserProfileCard({ user }) {
  if (!user) return null;

  const roleColors = {
    admin: "text-red-400 bg-red-400/10 border-red-400/20",
    analyst: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    viewer: "text-green-400 bg-green-400/10 border-green-400/20",
  };

  const roleIcons = {
    admin: <ShieldCheck className="w-4 h-4" />,
    analyst: <BadgeCheck className="w-4 h-4" />,
    viewer: <User className="w-4 h-4" />,
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-[#22D3EE]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Details</h3>
          <p className="text-sm text-gray-400">Your account information</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-[#22D3EE]/20">
            {user.initials ?? "?"}
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">
              {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${roleColors[user.role] || roleColors.viewer} uppercase tracking-wider`}>
                {roleIcons[user.role] || roleIcons.viewer}
                {user.role ?? "viewer"}
              </span>
              {user.is_approved && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#334155]">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Username</p>
            <p className="text-sm text-gray-200 font-mono">{user.username}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-200">{user.email || "Not provided"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</p>
            <p className="text-sm text-gray-200">{user.first_name || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</p>
            <p className="text-sm text-gray-200">{user.last_name || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
