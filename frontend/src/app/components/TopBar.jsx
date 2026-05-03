import { Search, Bell, Menu, PanelLeftClose, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function TopBar({ onToggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleBadgeColor =
    {
      admin: "text-[#EF4444] bg-[#EF4444]/10",
      analyst: "text-[#F59E0B] bg-[#F59E0B]/10",
      viewer: "text-[#10B981] bg-[#10B981]/10",
    }[user?.role] ?? "text-gray-400 bg-gray-400/10";

  return (
    <div className="h-16 bg-[#1E293B] border-b border-[#334155] px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400 hover:text-white"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs, alerts, IPs..."
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 ml-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] rounded-lg border border-[#334155]">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#10B981]">LIVE</span>
        </div>

        <button className="relative p-2 hover:bg-[#0F172A] rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-xs rounded-full flex items-center justify-center">
            7
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 pr-2 py-2 bg-[#0F172A] rounded-lg border border-[#334155]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user?.initials ?? "?"}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white leading-tight">
              {user?.first_name
                ? `${user.first_name} ${user.last_name}`
                : (user?.username ?? "User")}
            </p>
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${roleBadgeColor}`}
            >
              {user?.role ?? "viewer"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-1 p-1.5 hover:bg-[#334155] rounded-lg transition-colors text-gray-400 hover:text-[#EF4444]"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
